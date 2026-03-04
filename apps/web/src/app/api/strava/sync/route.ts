import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// Strava activity type to our ActivityType enum mapping
const ACTIVITY_TYPE_MAP: Record<string, 'run' | 'cycle' | 'swim' | 'walk' | 'triathlon'> = {
  Run: 'run',
  Ride: 'cycle',
  Swim: 'swim',
  Walk: 'walk',
  VirtualRun: 'run',
  VirtualRide: 'cycle',
  TrailRun: 'run',
  MountainBikeRide: 'cycle',
  GravelRide: 'cycle',
  Hike: 'walk',
}

interface StravaActivity {
  id: number
  type: string
  name: string
  start_date: string
  elapsed_time: number
  moving_time?: number
  distance?: number
  total_elevation_gain?: number
  average_heartrate?: number
  max_heartrate?: number
  average_watts?: number
}

async function refreshStravaToken(account: {
  id: string
  refresh_token: string | null
}): Promise<string | null> {
  if (!account.refresh_token) return null

  try {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: account.refresh_token,
      }),
    })

    if (!response.ok) return null

    const data = await response.json()

    // Update stored tokens
    await db.account.update({
      where: { id: account.id },
      data: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_at,
      },
    })

    return data.access_token
  } catch {
    return null
  }
}

async function fetchStravaActivities(
  accessToken: string,
  after?: number
): Promise<StravaActivity[]> {
  const params = new URLSearchParams({
    per_page: '200',
  })

  if (after) {
    params.set('after', String(after))
  }

  const response = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?${params}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Strava API error: ${response.status}`)
  }

  return response.json()
}

export async function POST() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get Strava account
    const account = await db.account.findFirst({
      where: {
        userId: session.user.id,
        provider: 'strava',
      },
    })

    if (!account?.access_token) {
      return NextResponse.json(
        { error: 'Strava not connected' },
        { status: 400 }
      )
    }

    // Check if token needs refresh
    let accessToken = account.access_token
    if (account.expires_at && account.expires_at * 1000 < Date.now()) {
      const newToken = await refreshStravaToken(account)
      if (!newToken) {
        return NextResponse.json(
          { error: 'Failed to refresh Strava token' },
          { status: 401 }
        )
      }
      accessToken = newToken
    }

    // Get last synced activity timestamp
    const lastActivity = await db.activity.findFirst({
      where: {
        userId: session.user.id,
        source: 'strava',
      },
      orderBy: { startTime: 'desc' },
    })

    const afterTimestamp = lastActivity
      ? Math.floor(lastActivity.startTime.getTime() / 1000)
      : undefined

    // Fetch activities from Strava
    const stravaActivities = await fetchStravaActivities(accessToken, afterTimestamp)

    // Transform and store activities
    let synced = 0
    for (const activity of stravaActivities) {
      const activityType = ACTIVITY_TYPE_MAP[activity.type]
      if (!activityType) continue

      // Use upsert to handle duplicates
      await db.activity.upsert({
        where: {
          userId_source_externalId: {
            userId: session.user.id,
            source: 'strava',
            externalId: String(activity.id),
          },
        },
        create: {
          userId: session.user.id,
          source: 'strava',
          externalId: String(activity.id),
          activityType,
          name: activity.name,
          startTime: new Date(activity.start_date),
          elapsedTime: activity.elapsed_time,
          movingTime: activity.moving_time,
          distance: activity.distance,
          elevationGain: activity.total_elevation_gain,
          averageHeartRate: activity.average_heartrate,
          maxHeartRate: activity.max_heartrate,
          averagePower: activity.average_watts,
          rawData: JSON.parse(JSON.stringify(activity)),
        },
        update: {
          name: activity.name,
          elapsedTime: activity.elapsed_time,
          movingTime: activity.moving_time,
          distance: activity.distance,
          elevationGain: activity.total_elevation_gain,
          averageHeartRate: activity.average_heartrate,
          maxHeartRate: activity.max_heartrate,
          averagePower: activity.average_watts,
          rawData: JSON.parse(JSON.stringify(activity)),
        },
      })
      synced++
    }

    return NextResponse.json({
      success: true,
      synced,
      total: stravaActivities.length,
    })
  } catch (error) {
    console.error('Strava sync error:', error)
    return NextResponse.json(
      { error: 'Sync failed' },
      { status: 500 }
    )
  }
}
