/**
 * Runstate Explanation
 *
 * Converts computed Runstate into human-readable language.
 * This module is responsible for all user-facing interpretation.
 *
 * Language guidelines (from ATOM):
 * - Calm, adult, respectful
 * - Never shame or celebrate
 * - State facts, not judgments
 * - No "do more" or "do less" messaging
 */

import type { RunstateResult, RunstateExplanation, TrendDirection } from './types'

/**
 * Describe load level in neutral terms.
 */
function describeLoad(load: number, baseline: number): string {
  const ratio = baseline > 0 ? load / baseline : 1

  if (ratio < 0.5) {
    return 'Your current load is well below your typical level.'
  }

  if (ratio < 0.8) {
    return 'Your current load is below your typical level.'
  }

  if (ratio <= 1.2) {
    return 'Your current load is around your typical level.'
  }

  if (ratio <= 1.5) {
    return 'Your current load is above your typical level.'
  }

  return 'Your current load is well above your typical level.'
}

/**
 * Describe trend direction.
 */
function describeTrend(trend: TrendDirection): string {
  switch (trend) {
    case 'rising':
      return 'Your load has been increasing over the past two weeks.'
    case 'falling':
      return 'Your load has been decreasing over the past two weeks.'
    case 'stable':
      return 'Your load has been consistent over the past two weeks.'
  }
}

/**
 * Describe activity balance.
 */
function describeBalance(balance: number): string {
  if (balance < -0.5) {
    return 'Your recent activity has been primarily running.'
  }

  if (balance < -0.2) {
    return 'Your recent activity leans toward running.'
  }

  if (balance <= 0.2) {
    return 'Your recent activity is balanced across types.'
  }

  if (balance <= 0.5) {
    return 'Your recent activity leans toward cycling.'
  }

  return 'Your recent activity has been primarily cycling.'
}

/**
 * Generate a one-sentence summary.
 */
function generateSummary(result: RunstateResult): string {
  const loadContext =
    result.baseline > 0
      ? result.load > result.baseline
        ? 'higher than'
        : result.load < result.baseline * 0.8
          ? 'lower than'
          : 'near'
      : 'at'

  const trendWord =
    result.trend === 'rising'
      ? 'increasing'
      : result.trend === 'falling'
        ? 'decreasing'
        : 'steady'

  return `Your current state is ${loadContext} baseline and ${trendWord}.`
}

/**
 * Generate human-readable explanation of Runstate.
 */
export function explainRunstate(result: RunstateResult): RunstateExplanation {
  return {
    summary: generateSummary(result),
    loadContext: describeLoad(result.load, result.baseline),
    trendContext: describeTrend(result.trend),
    balanceContext: describeBalance(result.balance),
  }
}

/**
 * Generate explanation for insufficient data.
 */
export function explainInsufficientData(
  activityCount: number,
  minimumRequired: number
): string {
  const needed = minimumRequired - activityCount

  if (activityCount === 0) {
    return 'Runstate needs activity data to understand your current state. Connect a data source or log activities to begin.'
  }

  return `Runstate needs ${needed} more ${needed === 1 ? 'activity' : 'activities'} to provide meaningful insight.`
}
