/**
 * Runstate Normalization
 *
 * Converts raw activity inputs into normalized activities with computed load.
 * The goal is to make disparate activity types comparable through a unified
 * physiological load model.
 */

import type {
  RawActivityInput,
  NormalizedActivity,
  ActivityType,
} from './types'

/**
 * Activity-specific coefficients for load calculation.
 *
 * These values are intentionally conservative starting points.
 * They should be refined based on sports science literature
 * and user feedback over time.
 *
 * The model uses a simplified training impulse (TRIMP) inspired approach:
 * Load = Duration × Intensity × TypeCoefficient
 */
const TYPE_COEFFICIENTS: Record<ActivityType, number> = {
  run: 1.0, // Baseline — running is the reference
  cycle: 0.7, // Lower weight-bearing impact
  swim: 0.8, // Full-body but buoyancy-supported
  walk: 0.5, // Lower intensity by nature
  triathlon: 1.2, // Combined stress
}

/**
 * Estimate intensity from available metrics.
 *
 * Priority order:
 * 1. Heart rate (if available) — most direct physiological measure
 * 2. Power (if available) — objective external load
 * 3. Pace/speed derived — fallback based on movement
 *
 * Returns value between 0 and 1.
 */
function estimateIntensity(input: RawActivityInput): number {
  // Heart rate based intensity (simplified zone model)
  if (input.averageHeartRate) {
    // Assume max HR of 190 if not personalized
    // This is a crude estimate — personalization would improve this
    const hrRatio = input.averageHeartRate / 190
    return Math.min(1, Math.max(0, hrRatio))
  }

  // Power based intensity (cycling primarily)
  if (input.averagePower && input.activityType === 'cycle') {
    // Assume FTP of 200W if not personalized
    const powerRatio = input.averagePower / 200
    return Math.min(1, Math.max(0, powerRatio * 0.8))
  }

  // Pace based fallback for running/walking
  if (input.distance && input.movingTime && input.movingTime > 0) {
    const paceMinPerKm = (input.movingTime / 60) / (input.distance / 1000)

    if (input.activityType === 'run') {
      // Sub 4:00/km = very high intensity, 8:00/km = low intensity
      const normalized = 1 - ((paceMinPerKm - 4) / 4)
      return Math.min(1, Math.max(0.2, normalized))
    }

    if (input.activityType === 'walk') {
      // Walking intensity is inherently lower
      return 0.3
    }
  }

  // Default moderate intensity when no data available
  return 0.5
}

/**
 * Calculate volume metric based on activity type.
 * This is the "raw" amount of work before intensity weighting.
 */
function calculateVolume(input: RawActivityInput): number {
  const duration = input.movingTime || input.elapsedTime

  switch (input.activityType) {
    case 'run':
    case 'walk':
      // Distance in km, or duration in minutes as fallback
      return input.distance ? input.distance / 1000 : duration / 60

    case 'cycle':
      // Distance weighted, cycling covers more ground
      return input.distance ? (input.distance / 1000) * 0.3 : duration / 60

    case 'swim':
      // Duration based — distance in pool is harder to compare
      return duration / 60

    case 'triathlon':
      // Duration based for combined events
      return duration / 60

    default:
      return duration / 60
  }
}

/**
 * Calculate normalized load score for an activity.
 *
 * The load score represents physiological stress on a 0-100 scale
 * where 100 is approximately a maximum single-session effort.
 */
function calculateLoad(
  duration: number,
  intensity: number,
  volume: number,
  activityType: ActivityType
): number {
  const coefficient = TYPE_COEFFICIENTS[activityType]

  // Base load from duration (in hours) and intensity
  const durationHours = duration / 3600
  const baseLoad = durationHours * intensity * 100

  // Apply type coefficient
  const adjustedLoad = baseLoad * coefficient

  // Cap at 100 for single activities
  return Math.min(100, Math.max(0, adjustedLoad))
}

/**
 * Normalize a single raw activity input.
 */
export function normalizeActivity(input: RawActivityInput): NormalizedActivity {
  const duration = input.movingTime || input.elapsedTime
  const intensity = estimateIntensity(input)
  const volume = calculateVolume(input)
  const load = calculateLoad(duration, intensity, volume, input.activityType)

  return {
    id: input.id,
    activityType: input.activityType,
    startTime: input.startTime,
    duration,
    load,
    intensity,
    volume,
  }
}

/**
 * Normalize a batch of raw activity inputs.
 */
export function normalizeActivities(
  inputs: RawActivityInput[]
): NormalizedActivity[] {
  return inputs.map(normalizeActivity)
}
