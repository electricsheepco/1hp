/**
 * Runstate Input Handling
 *
 * Responsible for accepting raw activity data from various sources
 * and preparing it for normalization.
 */

import type { RawActivityInput, ActivityType } from './types'

/**
 * Strava activity type mapping to internal types.
 */
const STRAVA_TYPE_MAP: Record<string, ActivityType> = {
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

/**
 * Supported activity types for Runstate computation.
 */
const SUPPORTED_TYPES = new Set<ActivityType>([
  'run',
  'cycle',
  'swim',
  'walk',
  'triathlon',
])

/**
 * Convert a Strava activity to our internal RawActivityInput format.
 */
export function fromStravaActivity(stravaActivity: {
  id: number
  type: string
  start_date: string
  elapsed_time: number
  moving_time?: number
  distance?: number
  total_elevation_gain?: number
  average_heartrate?: number
  max_heartrate?: number
  average_watts?: number
  name?: string
}): RawActivityInput | null {
  const activityType = STRAVA_TYPE_MAP[stravaActivity.type]

  if (!activityType || !SUPPORTED_TYPES.has(activityType)) {
    return null
  }

  return {
    id: `strava_${stravaActivity.id}`,
    source: 'strava',
    externalId: String(stravaActivity.id),
    activityType,
    startTime: new Date(stravaActivity.start_date),
    elapsedTime: stravaActivity.elapsed_time,
    movingTime: stravaActivity.moving_time,
    distance: stravaActivity.distance,
    elevationGain: stravaActivity.total_elevation_gain,
    averageHeartRate: stravaActivity.average_heartrate,
    maxHeartRate: stravaActivity.max_heartrate,
    averagePower: stravaActivity.average_watts,
    rawData: stravaActivity,
  }
}

/**
 * Validate that a raw activity input has the minimum required fields.
 */
export function validateInput(input: RawActivityInput): boolean {
  if (!input.id || !input.source || !input.activityType) {
    return false
  }

  if (!SUPPORTED_TYPES.has(input.activityType)) {
    return false
  }

  if (!input.startTime || !(input.startTime instanceof Date)) {
    return false
  }

  if (typeof input.elapsedTime !== 'number' || input.elapsedTime <= 0) {
    return false
  }

  return true
}

/**
 * Filter a list of raw inputs to only valid, supported activities.
 */
export function filterValidInputs(inputs: RawActivityInput[]): RawActivityInput[] {
  return inputs.filter(validateInput)
}
