import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  normalizeActivities,
  computeRunstate,
  explainRunstate,
  type RawActivityInput,
  type ActivityType,
} from '@1hp/runstate'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's activities from the past 90 days (for baseline)
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    const activities = await db.activity.findMany({
      where: {
        userId: session.user.id,
        startTime: { gte: ninetyDaysAgo },
      },
      orderBy: { startTime: 'desc' },
    })

    // Convert database activities to engine input format
    const rawInputs: RawActivityInput[] = activities.map((activity) => ({
      id: activity.id,
      source: activity.source,
      externalId: activity.externalId || undefined,
      activityType: activity.activityType as ActivityType,
      startTime: activity.startTime,
      elapsedTime: activity.elapsedTime,
      movingTime: activity.movingTime || undefined,
      distance: activity.distance || undefined,
      elevationGain: activity.elevationGain || undefined,
      averageHeartRate: activity.averageHeartRate || undefined,
      maxHeartRate: activity.maxHeartRate || undefined,
      averagePower: activity.averagePower || undefined,
    }))

    // Normalize activities
    const normalizedActivities = normalizeActivities(rawInputs)

    // Compute Runstate
    const result = computeRunstate(normalizedActivities)

    if (!result) {
      // Not enough activities
      const windowActivities = activities.filter((a) => {
        const cutoff = new Date()
        cutoff.setDate(cutoff.getDate() - 28)
        return a.startTime >= cutoff
      })

      return NextResponse.json({
        state: 'insufficient',
        activityCount: windowActivities.length,
        minimumRequired: 3,
      })
    }

    // Generate explanation
    const explanation = explainRunstate(result)

    // Store snapshot
    await db.runstateSnapshot.create({
      data: {
        userId: session.user.id,
        load: result.load,
        trend: result.trend,
        baseline: result.baseline,
        balance: result.balance,
        inputWindow: result.inputWindow,
        inputCount: result.inputCount,
      },
    })

    // Get daily load data for heatmap (current year)
    const yearStart = new Date(new Date().getFullYear(), 0, 1)
    const dailyActivities = await db.activity.findMany({
      where: {
        userId: session.user.id,
        startTime: { gte: yearStart },
      },
      select: {
        startTime: true,
        elapsedTime: true,
        movingTime: true,
        distance: true,
        averageHeartRate: true,
        activityType: true,
      },
      orderBy: { startTime: 'asc' },
    })

    // Aggregate daily loads
    const dailyLoads: Record<string, number> = {}
    for (const activity of dailyActivities) {
      const dateKey = activity.startTime.toISOString().split('T')[0]

      // Simple load estimate for heatmap
      const duration = (activity.movingTime || activity.elapsedTime) / 3600
      const intensity = activity.averageHeartRate
        ? Math.min(1, activity.averageHeartRate / 190)
        : 0.5
      const load = duration * intensity * 100

      dailyLoads[dateKey] = (dailyLoads[dateKey] || 0) + load
    }

    const loadHistory = Object.entries(dailyLoads).map(([date, load]) => ({
      date,
      load: Math.round(load * 10) / 10,
    }))

    // Calculate metrics grouped by activity type (last 28 days)
    const twentyEightDaysAgo = new Date()
    twentyEightDaysAgo.setDate(twentyEightDaysAgo.getDate() - 28)

    const recentActivities = activities.filter(
      (a) => a.startTime >= twentyEightDaysAgo
    )

    // Format pace as mm:ss
    const formatPace = (pace: number) => {
      const mins = Math.floor(pace)
      const secs = Math.round((pace - mins) * 60)
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    // Format duration as hh:mm or mm:ss
    const formatDuration = (seconds: number) => {
      const hours = Math.floor(seconds / 3600)
      const mins = Math.floor((seconds % 3600) / 60)
      if (hours > 0) {
        return `${hours}h ${mins}m`
      }
      return `${mins}m`
    }

    // Format date for display
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    }

    // Group by activity type
    const activityTypes = ['run', 'cycle', 'swim', 'walk'] as const
    const activityMetrics: Record<string, {
      type: string
      label: string
      count: number
      totalDuration: number
      totalDurationFormatted: string
      totalDistance: number | null
      avgPace: string | null
      avgPaceRaw: number | null
      bestPace: string | null
      bestPaceRaw: number | null
      avgSpeed: number | null // km/h for cycling
      avgHeartRate: number | null
      recentActivities: Array<{
        id: string
        name: string | null
        date: string
        duration: string
        distance: string | null
        pace: string | null
        speed: string | null
        heartRate: number | null
      }>
    }> = {}

    const typeLabels: Record<string, string> = {
      run: 'Running',
      cycle: 'Cycling',
      swim: 'Swimming',
      walk: 'Walking',
    }

    for (const type of activityTypes) {
      const typeActivities = recentActivities.filter((a) => a.activityType === type)

      if (typeActivities.length === 0) continue

      const totalDuration = typeActivities.reduce(
        (sum, a) => sum + (a.movingTime || a.elapsedTime),
        0
      )

      const activitiesWithDistance = typeActivities.filter((a) => a.distance && a.distance > 0)
      const totalDistance = activitiesWithDistance.reduce(
        (sum, a) => sum + (a.distance as number),
        0
      )

      const activitiesWithHR = typeActivities.filter((a) => a.averageHeartRate)
      const avgHeartRate = activitiesWithHR.length > 0
        ? Math.round(
            activitiesWithHR.reduce((sum, a) => sum + (a.averageHeartRate as number), 0) /
            activitiesWithHR.length
          )
        : null

      // Pace for run/walk (min/km)
      let avgPace: string | null = null
      let avgPaceRaw: number | null = null
      let bestPace: string | null = null
      let bestPaceRaw: number | null = null
      let avgSpeed: number | null = null

      if ((type === 'run' || type === 'walk') && activitiesWithDistance.length > 0) {
        const paces = activitiesWithDistance.map((a) => {
          const time = a.movingTime || a.elapsedTime
          const distanceKm = (a.distance as number) / 1000
          return (time / 60) / distanceKm
        })

        const avgPaceVal = paces.reduce((sum, p) => sum + p, 0) / paces.length
        avgPace = formatPace(avgPaceVal)
        avgPaceRaw = Math.round(avgPaceVal * 100) / 100

        const bestPaceVal = Math.min(...paces)
        bestPace = formatPace(bestPaceVal)
        bestPaceRaw = Math.round(bestPaceVal * 100) / 100
      }

      // Speed for cycling (km/h)
      if (type === 'cycle' && activitiesWithDistance.length > 0) {
        const speeds = activitiesWithDistance.map((a) => {
          const timeHours = (a.movingTime || a.elapsedTime) / 3600
          const distanceKm = (a.distance as number) / 1000
          return distanceKm / timeHours
        })

        avgSpeed = Math.round(speeds.reduce((sum, s) => sum + s, 0) / speeds.length * 10) / 10
      }

      // Build recent activities list (most recent first, limit 10)
      const recentActivityList = typeActivities.slice(0, 10).map((a) => {
        const time = a.movingTime || a.elapsedTime
        const distanceKm = a.distance ? a.distance / 1000 : null

        let pace: string | null = null
        let speed: string | null = null

        if (distanceKm && distanceKm > 0) {
          if (type === 'run' || type === 'walk') {
            const paceVal = (time / 60) / distanceKm
            pace = formatPace(paceVal)
          }
          if (type === 'cycle') {
            const speedVal = distanceKm / (time / 3600)
            speed = `${Math.round(speedVal * 10) / 10}`
          }
        }

        return {
          id: a.id,
          name: a.name,
          date: formatDate(a.startTime),
          duration: formatDuration(time),
          distance: distanceKm ? `${Math.round(distanceKm * 10) / 10} km` : null,
          pace,
          speed,
          heartRate: a.averageHeartRate ? Math.round(a.averageHeartRate) : null,
        }
      })

      activityMetrics[type] = {
        type,
        label: typeLabels[type],
        count: typeActivities.length,
        totalDuration,
        totalDurationFormatted: formatDuration(totalDuration),
        totalDistance: totalDistance > 0 ? Math.round(totalDistance / 100) / 10 : null, // km with 1 decimal
        avgPace,
        avgPaceRaw,
        bestPace,
        bestPaceRaw,
        avgSpeed,
        avgHeartRate,
        recentActivities: recentActivityList,
      }
    }

    return NextResponse.json({
      state: 'active',
      result,
      explanation,
      loadHistory,
      activityMetrics,
    })
  } catch (error) {
    console.error('Runstate computation error:', error)
    return NextResponse.json(
      { error: 'Computation failed' },
      { status: 500 }
    )
  }
}
