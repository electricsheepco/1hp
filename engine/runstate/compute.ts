/**
 * Runstate Computation
 *
 * Core computation logic for deriving Runstate from normalized activities.
 * This module is the heart of the intelligence layer.
 */

import type {
  NormalizedActivity,
  RunstateResult,
  RunstateConfig,
  TrendDirection,
  ActivityType,
} from './types'

/**
 * Default configuration for Runstate computation.
 */
export const DEFAULT_CONFIG: RunstateConfig = {
  windowDays: 28, // 4 weeks of recent activity
  minimumActivities: 3, // Need at least 3 activities for meaningful computation
  baselineWindowDays: 90, // 3 months for baseline
}

/**
 * Filter activities to those within a time window.
 */
function filterByWindow(
  activities: NormalizedActivity[],
  windowDays: number,
  referenceDate: Date = new Date()
): NormalizedActivity[] {
  const cutoff = new Date(referenceDate)
  cutoff.setDate(cutoff.getDate() - windowDays)

  return activities.filter((a) => a.startTime >= cutoff)
}

/**
 * Calculate cumulative load with time decay.
 *
 * More recent activities contribute more to current load.
 * Uses exponential decay with a 7-day half-life.
 */
function calculateCumulativeLoad(
  activities: NormalizedActivity[],
  referenceDate: Date = new Date()
): number {
  const HALF_LIFE_DAYS = 7

  return activities.reduce((total, activity) => {
    const daysSince =
      (referenceDate.getTime() - activity.startTime.getTime()) /
      (1000 * 60 * 60 * 24)

    // Exponential decay factor
    const decay = Math.pow(0.5, daysSince / HALF_LIFE_DAYS)

    return total + activity.load * decay
  }, 0)
}

/**
 * Determine trend direction by comparing recent vs. older load.
 */
function calculateTrend(
  activities: NormalizedActivity[],
  referenceDate: Date = new Date()
): TrendDirection {
  const recentCutoff = new Date(referenceDate)
  recentCutoff.setDate(recentCutoff.getDate() - 7)

  const olderCutoff = new Date(referenceDate)
  olderCutoff.setDate(olderCutoff.getDate() - 14)

  const recentActivities = activities.filter((a) => a.startTime >= recentCutoff)
  const olderActivities = activities.filter(
    (a) => a.startTime >= olderCutoff && a.startTime < recentCutoff
  )

  const recentLoad = recentActivities.reduce((sum, a) => sum + a.load, 0)
  const olderLoad = olderActivities.reduce((sum, a) => sum + a.load, 0)

  // Threshold for detecting meaningful change (20%)
  const threshold = 0.2

  if (olderLoad === 0) {
    return recentLoad > 0 ? 'rising' : 'stable'
  }

  const changeRatio = (recentLoad - olderLoad) / olderLoad

  if (changeRatio > threshold) {
    return 'rising'
  } else if (changeRatio < -threshold) {
    return 'falling'
  }

  return 'stable'
}

/**
 * Calculate cross-activity balance.
 *
 * Returns a value from -1 to 1:
 * - Negative values indicate running-dominant
 * - Positive values indicate cycling-dominant
 * - Zero indicates balanced
 *
 * Swimming and walking contribute to balance as "other"
 */
function calculateBalance(activities: NormalizedActivity[]): number {
  const loadByType: Record<string, number> = {
    run: 0,
    cycle: 0,
    other: 0,
  }

  activities.forEach((a) => {
    if (a.activityType === 'run') {
      loadByType.run += a.load
    } else if (a.activityType === 'cycle') {
      loadByType.cycle += a.load
    } else {
      loadByType.other += a.load
    }
  })

  const totalLoad = loadByType.run + loadByType.cycle + loadByType.other

  if (totalLoad === 0) {
    return 0
  }

  // Calculate imbalance between run and cycle
  // Positive = cycle heavy, negative = run heavy
  const runCycleTotal = loadByType.run + loadByType.cycle

  if (runCycleTotal === 0) {
    return 0
  }

  const balance = (loadByType.cycle - loadByType.run) / runCycleTotal

  return Math.max(-1, Math.min(1, balance))
}

/**
 * Calculate personal baseline from historical data.
 */
function calculateBaseline(
  activities: NormalizedActivity[],
  windowDays: number
): number {
  if (activities.length === 0) {
    return 0
  }

  // Weekly average load over the baseline window
  const weeks = windowDays / 7
  const totalLoad = activities.reduce((sum, a) => sum + a.load, 0)

  return totalLoad / weeks
}

/**
 * Compute Runstate from normalized activities.
 *
 * This is the main entry point for the computation engine.
 */
export function computeRunstate(
  activities: NormalizedActivity[],
  config: RunstateConfig = DEFAULT_CONFIG,
  referenceDate: Date = new Date()
): RunstateResult | null {
  // Filter to window
  const windowActivities = filterByWindow(
    activities,
    config.windowDays,
    referenceDate
  )

  // Check minimum activity requirement
  if (windowActivities.length < config.minimumActivities) {
    return null
  }

  // Get baseline activities (longer window)
  const baselineActivities = filterByWindow(
    activities,
    config.baselineWindowDays,
    referenceDate
  )

  // Compute all metrics
  const load = calculateCumulativeLoad(windowActivities, referenceDate)
  const trend = calculateTrend(windowActivities, referenceDate)
  const baseline = calculateBaseline(baselineActivities, config.baselineWindowDays)
  const balance = calculateBalance(windowActivities)

  return {
    load: Math.round(load * 10) / 10, // Round to 1 decimal
    trend,
    baseline: Math.round(baseline * 10) / 10,
    balance: Math.round(balance * 100) / 100, // Round to 2 decimals
    inputWindow: config.windowDays,
    inputCount: windowActivities.length,
    computedAt: referenceDate,
  }
}
