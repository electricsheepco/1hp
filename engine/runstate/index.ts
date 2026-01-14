/**
 * @1hp/runstate
 *
 * The Runstate computation engine.
 * Responsible for transforming activity data into unified physiological state.
 *
 * Architecture boundary: This module contains NO UI, API, or analytics logic.
 */

// Types
export type {
  ActivityType,
  TrendDirection,
  RawActivityInput,
  NormalizedActivity,
  RunstateConfig,
  RunstateResult,
  RunstateExplanation,
} from './types'

// Input handling
export { fromStravaActivity, validateInput, filterValidInputs } from './inputs'

// Normalization
export { normalizeActivity, normalizeActivities } from './normalize'

// Computation
export { computeRunstate, DEFAULT_CONFIG } from './compute'

// Explanation
export { explainRunstate, explainInsufficientData } from './explain'
