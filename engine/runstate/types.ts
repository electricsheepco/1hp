/**
 * Runstate Engine Types
 *
 * These types define the contracts for the Runstate computation system.
 * The engine is intentionally isolated from UI, API, and analytics concerns.
 */

export type ActivityType = 'run' | 'cycle' | 'swim' | 'walk' | 'triathlon'

export type TrendDirection = 'rising' | 'stable' | 'falling'

/**
 * Raw activity input from any source (Strava, manual, etc.)
 * This is what we receive before normalization.
 */
export interface RawActivityInput {
  id: string
  source: string
  externalId?: string
  activityType: ActivityType
  startTime: Date
  elapsedTime: number // seconds
  movingTime?: number // seconds
  distance?: number // meters
  elevationGain?: number // meters
  averageHeartRate?: number
  maxHeartRate?: number
  averagePower?: number // watts
  rawData?: unknown
}

/**
 * Normalized activity with computed load.
 * All activities regardless of type are converted to this format.
 */
export interface NormalizedActivity {
  id: string
  activityType: ActivityType
  startTime: Date
  duration: number // seconds (uses movingTime if available, else elapsedTime)
  load: number // Normalized load score (0-100 scale per activity)
  intensity: number // Relative intensity (0-1)
  volume: number // Raw volume metric (type-dependent)
}

/**
 * Configuration for the Runstate computation engine.
 */
export interface RunstateConfig {
  windowDays: number // How many days to consider
  minimumActivities: number // Minimum activities needed for valid computation
  baselineWindowDays: number // Days to use for baseline calculation
}

/**
 * The computed Runstate for a user at a point in time.
 */
export interface RunstateResult {
  load: number // Current cumulative load
  trend: TrendDirection // Direction of load change
  baseline: number // Personal baseline reference
  balance: number // Cross-activity balance (-1 to 1, 0 = balanced)
  inputWindow: number // Days of data used
  inputCount: number // Number of activities considered
  computedAt: Date
}

/**
 * Human-readable explanation of a Runstate result.
 */
export interface RunstateExplanation {
  summary: string // One sentence overview
  loadContext: string // What the load value means
  trendContext: string // What the trend indicates
  balanceContext: string // Cross-activity balance interpretation
}
