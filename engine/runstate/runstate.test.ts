/**
 * Runstate Engine Test Harness
 *
 * Tests the full pipeline: raw input → normalize → compute → explain
 *
 * Data sources considered:
 * - Strava (dominant, ~80% market share for endurance athletes)
 * - Garmin Connect (strong in running/triathlon)
 * - Apple Health (aggregator, growing)
 * - Wahoo (cycling focused)
 * - Polar Flow (HR-focused athletes)
 * - Coros (ultrarunners)
 * - Suunto (outdoor/trail)
 *
 * For MVP, Strava is the right choice. Others can be added later
 * since they all provide similar data structures.
 */

import { describe, it, expect } from 'vitest'
import {
  fromStravaActivity,
  normalizeActivity,
  normalizeActivities,
  computeRunstate,
  explainRunstate,
  explainInsufficientData,
  validateInput,
  DEFAULT_CONFIG,
  type RawActivityInput,
} from './index'

// -----------------------------------------------------------------------------
// Mock Data: Simulates what we'd get from Strava API
// -----------------------------------------------------------------------------

/**
 * Creates a mock Strava activity
 */
function mockStravaActivity(overrides: {
  id?: number
  type?: string
  daysAgo?: number
  elapsed_time?: number
  moving_time?: number
  distance?: number
  average_heartrate?: number
  average_cadence?: number
  average_watts?: number
  total_elevation_gain?: number
}) {
  const daysAgo = overrides.daysAgo ?? 0
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)

  return {
    id: overrides.id ?? Math.floor(Math.random() * 1000000),
    type: overrides.type ?? 'Run',
    start_date: date.toISOString(),
    elapsed_time: overrides.elapsed_time ?? 3600,
    moving_time: overrides.moving_time ?? 3500,
    distance: overrides.distance ?? 10000,
    average_heartrate: overrides.average_heartrate,
    average_cadence: overrides.average_cadence,
    average_watts: overrides.average_watts,
    total_elevation_gain: overrides.total_elevation_gain ?? 50,
    name: 'Test Activity',
  }
}

/**
 * Calculate expected pace from stride length and cadence
 *
 * This demonstrates the input→output relationship:
 * - stride_length (meters) × cadence (steps/min) = speed (m/min)
 * - pace = 1000 / speed (min/km)
 *
 * Strava provides cadence (spm) but not stride length directly.
 * Stride length can be derived: distance / (cadence × duration × 2)
 */
function calculatePaceFromComponents(
  strideLength: number, // meters
  cadence: number // steps per minute (single leg)
): number {
  // Full cadence = both legs = cadence × 2
  const speedMPerMin = strideLength * cadence * 2
  const paceMinPerKm = 1000 / speedMPerMin
  return paceMinPerKm
}

/**
 * Derive stride length from activity data
 */
function deriveStrideLength(
  distance: number, // meters
  duration: number, // seconds
  cadence: number // steps per minute (single leg)
): number {
  const durationMinutes = duration / 60
  const totalSteps = cadence * 2 * durationMinutes // both legs
  return distance / totalSteps
}

// -----------------------------------------------------------------------------
// Test Suites
// -----------------------------------------------------------------------------

describe('Input Handling', () => {
  describe('fromStravaActivity', () => {
    it('converts a basic run activity', () => {
      const strava = mockStravaActivity({
        id: 12345,
        type: 'Run',
        distance: 10000,
        elapsed_time: 3600,
        moving_time: 3500,
      })

      const result = fromStravaActivity(strava)

      expect(result).not.toBeNull()
      expect(result!.id).toBe('strava_12345')
      expect(result!.source).toBe('strava')
      expect(result!.activityType).toBe('run')
      expect(result!.distance).toBe(10000)
      expect(result!.elapsedTime).toBe(3600)
      expect(result!.movingTime).toBe(3500)
    })

    it('maps different Strava activity types correctly', () => {
      const types = [
        { strava: 'Run', expected: 'run' },
        { strava: 'VirtualRun', expected: 'run' },
        { strava: 'TrailRun', expected: 'run' },
        { strava: 'Ride', expected: 'cycle' },
        { strava: 'VirtualRide', expected: 'cycle' },
        { strava: 'MountainBikeRide', expected: 'cycle' },
        { strava: 'GravelRide', expected: 'cycle' },
        { strava: 'Swim', expected: 'swim' },
        { strava: 'Walk', expected: 'walk' },
        { strava: 'Hike', expected: 'walk' },
      ]

      for (const { strava, expected } of types) {
        const activity = mockStravaActivity({ type: strava })
        const result = fromStravaActivity(activity)
        expect(result?.activityType).toBe(expected)
      }
    })

    it('returns null for unsupported activity types', () => {
      const unsupported = ['Yoga', 'WeightTraining', 'Crossfit', 'Soccer']

      for (const type of unsupported) {
        const activity = mockStravaActivity({ type })
        const result = fromStravaActivity(activity)
        expect(result).toBeNull()
      }
    })

    it('preserves heart rate data', () => {
      const strava = mockStravaActivity({
        type: 'Run',
        average_heartrate: 155,
      })

      const result = fromStravaActivity(strava)
      expect(result!.averageHeartRate).toBe(155)
    })

    it('preserves power data for cycling', () => {
      const strava = mockStravaActivity({
        type: 'Ride',
        average_watts: 220,
      })

      const result = fromStravaActivity(strava)
      expect(result!.averagePower).toBe(220)
    })
  })

  describe('validateInput', () => {
    it('accepts valid input', () => {
      const input: RawActivityInput = {
        id: 'test_1',
        source: 'strava',
        activityType: 'run',
        startTime: new Date(),
        elapsedTime: 3600,
        distance: 10000,
      }

      expect(validateInput(input)).toBe(true)
    })

    it('rejects input without elapsed time', () => {
      const input: RawActivityInput = {
        id: 'test_1',
        source: 'strava',
        activityType: 'run',
        startTime: new Date(),
        elapsedTime: 0,
      }

      expect(validateInput(input)).toBe(false)
    })
  })
})

describe('Normalization', () => {
  describe('normalizeActivity', () => {
    it('calculates intensity from heart rate', () => {
      const input: RawActivityInput = {
        id: 'test_1',
        source: 'test',
        activityType: 'run',
        startTime: new Date(),
        elapsedTime: 3600,
        averageHeartRate: 152, // ~80% of 190
      }

      const normalized = normalizeActivity(input)

      expect(normalized.intensity).toBeCloseTo(0.8, 1)
    })

    it('calculates intensity from pace when no HR available', () => {
      const input: RawActivityInput = {
        id: 'test_1',
        source: 'test',
        activityType: 'run',
        startTime: new Date(),
        elapsedTime: 3000,
        movingTime: 3000,
        distance: 10000, // 10km in 50min = 5:00/km pace
      }

      const normalized = normalizeActivity(input)

      // 5:00/km pace should yield moderate-high intensity
      // Formula: 1 - ((pace - 4) / 4) = 1 - ((5 - 4) / 4) = 0.75
      expect(normalized.intensity).toBeCloseTo(0.75, 1)
    })

    it('calculates load as function of duration and intensity', () => {
      // 1 hour run at moderate intensity
      const input: RawActivityInput = {
        id: 'test_1',
        source: 'test',
        activityType: 'run',
        startTime: new Date(),
        elapsedTime: 3600, // 1 hour
        movingTime: 3600,
        averageHeartRate: 140, // ~74% of 190
      }

      const normalized = normalizeActivity(input)

      // Load = (duration_hours × intensity × 100) × type_coefficient
      // = (1 × 0.74 × 100) × 1.0 = ~74
      expect(normalized.load).toBeGreaterThan(50)
      expect(normalized.load).toBeLessThan(90)
    })

    it('applies type coefficients correctly', () => {
      const baseInput = {
        source: 'test',
        startTime: new Date(),
        elapsedTime: 3600,
        movingTime: 3600,
        averageHeartRate: 150, // Same HR for all
      }

      const run = normalizeActivity({
        ...baseInput,
        id: 'run_1',
        activityType: 'run',
      })

      const cycle = normalizeActivity({
        ...baseInput,
        id: 'cycle_1',
        activityType: 'cycle',
      })

      const walk = normalizeActivity({
        ...baseInput,
        id: 'walk_1',
        activityType: 'walk',
      })

      // Run coefficient: 1.0
      // Cycle coefficient: 0.7
      // Walk coefficient: 0.5
      expect(run.load).toBeGreaterThan(cycle.load)
      expect(cycle.load).toBeGreaterThan(walk.load)
      expect(cycle.load / run.load).toBeCloseTo(0.7, 1)
      expect(walk.load / run.load).toBeCloseTo(0.5, 1)
    })
  })
})

describe('Computation', () => {
  /**
   * Helper to generate a month of activities
   */
  function generateActivityHistory(
    activitiesPerWeek: number,
    weekCount: number = 4
  ): RawActivityInput[] {
    const activities: RawActivityInput[] = []

    for (let week = 0; week < weekCount; week++) {
      for (let i = 0; i < activitiesPerWeek; i++) {
        const daysAgo = week * 7 + i * 2 // Every other day within week
        const date = new Date()
        date.setDate(date.getDate() - daysAgo)

        activities.push({
          id: `activity_${week}_${i}`,
          source: 'test',
          activityType: 'run',
          startTime: date,
          elapsedTime: 3600,
          movingTime: 3500,
          distance: 10000,
          averageHeartRate: 145 + Math.random() * 20, // 145-165 HR
        })
      }
    }

    return activities
  }

  describe('computeRunstate', () => {
    it('returns null when insufficient activities', () => {
      const activities = [
        normalizeActivity({
          id: 'test_1',
          source: 'test',
          activityType: 'run',
          startTime: new Date(),
          elapsedTime: 3600,
        }),
      ]

      const result = computeRunstate(activities)
      expect(result).toBeNull()
    })

    it('computes runstate with sufficient data', () => {
      const rawActivities = generateActivityHistory(3, 4) // 3 per week for 4 weeks
      const normalized = normalizeActivities(rawActivities)
      const result = computeRunstate(normalized)

      expect(result).not.toBeNull()
      expect(result!.load).toBeGreaterThan(0)
      expect(result!.inputCount).toBeGreaterThanOrEqual(3)
      expect(['rising', 'stable', 'falling']).toContain(result!.trend)
    })

    it('applies time decay to load calculation', () => {
      // Create two scenarios: all recent vs all old activities
      const recentActivities: RawActivityInput[] = []
      const oldActivities: RawActivityInput[] = []

      for (let i = 0; i < 5; i++) {
        const recentDate = new Date()
        recentDate.setDate(recentDate.getDate() - i) // Last 5 days

        const oldDate = new Date()
        oldDate.setDate(oldDate.getDate() - 20 - i) // 20-25 days ago

        const baseActivity = {
          source: 'test',
          activityType: 'run' as const,
          elapsedTime: 3600,
          movingTime: 3500,
          distance: 10000,
          averageHeartRate: 150,
        }

        recentActivities.push({
          ...baseActivity,
          id: `recent_${i}`,
          startTime: recentDate,
        })

        oldActivities.push({
          ...baseActivity,
          id: `old_${i}`,
          startTime: oldDate,
        })
      }

      const recentNormalized = normalizeActivities(recentActivities)
      const oldNormalized = normalizeActivities(oldActivities)

      const recentResult = computeRunstate(recentNormalized)
      const oldResult = computeRunstate(oldNormalized)

      // Recent activities should contribute more to load
      expect(recentResult!.load).toBeGreaterThan(oldResult!.load)
    })

    it('detects rising trend when load increases', () => {
      const activities: RawActivityInput[] = []

      // Week 1 (older): light activity
      for (let i = 0; i < 2; i++) {
        const date = new Date()
        date.setDate(date.getDate() - 10 - i)
        activities.push({
          id: `light_${i}`,
          source: 'test',
          activityType: 'run',
          startTime: date,
          elapsedTime: 1800, // 30 min
          distance: 5000,
          averageHeartRate: 130,
        })
      }

      // Week 2 (recent): heavy activity
      for (let i = 0; i < 3; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        activities.push({
          id: `heavy_${i}`,
          source: 'test',
          activityType: 'run',
          startTime: date,
          elapsedTime: 5400, // 90 min
          distance: 15000,
          averageHeartRate: 165,
        })
      }

      const normalized = normalizeActivities(activities)
      const result = computeRunstate(normalized)

      expect(result!.trend).toBe('rising')
    })

    it('detects falling trend when load decreases', () => {
      const activities: RawActivityInput[] = []

      // Week 1 (older): heavy activity
      for (let i = 0; i < 3; i++) {
        const date = new Date()
        date.setDate(date.getDate() - 10 - i)
        activities.push({
          id: `heavy_${i}`,
          source: 'test',
          activityType: 'run',
          startTime: date,
          elapsedTime: 5400, // 90 min
          distance: 15000,
          averageHeartRate: 165,
        })
      }

      // Week 2 (recent): light activity
      for (let i = 0; i < 2; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        activities.push({
          id: `light_${i}`,
          source: 'test',
          activityType: 'run',
          startTime: date,
          elapsedTime: 1800, // 30 min
          distance: 5000,
          averageHeartRate: 130,
        })
      }

      const normalized = normalizeActivities(activities)
      const result = computeRunstate(normalized)

      expect(result!.trend).toBe('falling')
    })

    it('calculates activity balance', () => {
      // Run-heavy profile
      const runHeavy: RawActivityInput[] = []
      for (let i = 0; i < 5; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i * 2)
        runHeavy.push({
          id: `run_${i}`,
          source: 'test',
          activityType: 'run',
          startTime: date,
          elapsedTime: 3600,
          averageHeartRate: 150,
        })
      }

      // Cycle-heavy profile
      const cycleHeavy: RawActivityInput[] = []
      for (let i = 0; i < 5; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i * 2)
        cycleHeavy.push({
          id: `cycle_${i}`,
          source: 'test',
          activityType: 'cycle',
          startTime: date,
          elapsedTime: 3600,
          averageHeartRate: 150,
        })
      }

      const runResult = computeRunstate(normalizeActivities(runHeavy))
      const cycleResult = computeRunstate(normalizeActivities(cycleHeavy))

      expect(runResult!.balance).toBeLessThan(0) // Negative = run heavy
      expect(cycleResult!.balance).toBeGreaterThan(0) // Positive = cycle heavy
    })
  })
})

describe('Explanation', () => {
  describe('explainRunstate', () => {
    it('generates appropriate explanation for high load', () => {
      const result = {
        load: 80,
        trend: 'rising' as const,
        baseline: 50,
        balance: 0,
        inputWindow: 28,
        inputCount: 15,
        computedAt: new Date(),
      }

      const explanation = explainRunstate(result)

      expect(explanation.summary).toContain('higher than')
      expect(explanation.loadContext).toContain('above')
      expect(explanation.trendContext).toContain('increasing')
    })

    it('generates appropriate explanation for low load', () => {
      const result = {
        load: 20,
        trend: 'falling' as const,
        baseline: 50,
        balance: 0,
        inputWindow: 28,
        inputCount: 5,
        computedAt: new Date(),
      }

      const explanation = explainRunstate(result)

      expect(explanation.summary).toContain('lower than')
      expect(explanation.loadContext).toContain('below')
    })

    it('describes run-heavy balance', () => {
      const result = {
        load: 50,
        trend: 'stable' as const,
        baseline: 50,
        balance: -0.7, // Run heavy
        inputWindow: 28,
        inputCount: 10,
        computedAt: new Date(),
      }

      const explanation = explainRunstate(result)

      expect(explanation.balanceContext).toContain('running')
    })
  })

  describe('explainInsufficientData', () => {
    it('explains zero activities', () => {
      const explanation = explainInsufficientData(0, 3)
      expect(explanation).toContain('needs activity data')
    })

    it('explains partial data', () => {
      const explanation = explainInsufficientData(1, 3)
      expect(explanation).toContain('2 more activities')
    })
  })
})

describe('Pace Calculation (Input/Output Relationship)', () => {
  /**
   * These tests demonstrate how derived metrics work.
   * Pace isn't stored — it's calculated from distance and time.
   * But it can also be understood as stride_length × cadence.
   */

  it('calculates pace from distance and time', () => {
    // 10km in 50 minutes = 5:00/km
    const distance = 10000 // meters
    const duration = 3000 // seconds (50 min)

    const paceMinPerKm = (duration / 60) / (distance / 1000)

    expect(paceMinPerKm).toBe(5)
  })

  it('calculates pace from stride length and cadence', () => {
    // Typical values: 1.2m stride, 180 spm cadence
    const strideLength = 1.2 // meters
    const cadence = 90 // single leg spm (180 total)

    const pace = calculatePaceFromComponents(strideLength, cadence)

    // 1.2m × 180 steps/min = 216 m/min = 3.6 m/s
    // 1000m / 216 m/min = 4.63 min/km
    expect(pace).toBeCloseTo(4.63, 1)
  })

  it('derives stride length from activity data', () => {
    // 10km run in 50 minutes with 180 cadence
    const distance = 10000 // meters
    const duration = 3000 // seconds
    const cadence = 90 // single leg (180 total)

    const strideLength = deriveStrideLength(distance, duration, cadence)

    // 10000m / (180 × 50 min) = 10000 / 9000 = 1.11m
    expect(strideLength).toBeCloseTo(1.11, 2)
  })

  it('shows relationship: faster pace = longer stride OR higher cadence', () => {
    // Baseline: 5:00/km pace
    const baseline = calculatePaceFromComponents(1.0, 90) // 1m stride, 180 spm
    expect(baseline).toBeCloseTo(5.56, 1)

    // Faster via longer stride
    const longerStride = calculatePaceFromComponents(1.2, 90)
    expect(longerStride).toBeLessThan(baseline)

    // Faster via higher cadence
    const higherCadence = calculatePaceFromComponents(1.0, 95) // 190 spm
    expect(higherCadence).toBeLessThan(baseline)
  })
})

describe('Full Pipeline Integration', () => {
  it('processes Strava data through entire pipeline', () => {
    // Simulate a month of Strava data
    const stravaActivities = [
      mockStravaActivity({ daysAgo: 1, type: 'Run', distance: 8000, elapsed_time: 2700, average_heartrate: 155 }),
      mockStravaActivity({ daysAgo: 3, type: 'Ride', distance: 40000, elapsed_time: 5400, average_heartrate: 140, average_watts: 180 }),
      mockStravaActivity({ daysAgo: 5, type: 'Run', distance: 12000, elapsed_time: 4200, average_heartrate: 160 }),
      mockStravaActivity({ daysAgo: 7, type: 'Swim', elapsed_time: 2700, average_heartrate: 135 }),
      mockStravaActivity({ daysAgo: 9, type: 'Run', distance: 6000, elapsed_time: 2100, average_heartrate: 145 }),
      mockStravaActivity({ daysAgo: 11, type: 'TrailRun', distance: 15000, elapsed_time: 6000, average_heartrate: 150 }),
      mockStravaActivity({ daysAgo: 14, type: 'Ride', distance: 60000, elapsed_time: 7200, average_heartrate: 145 }),
    ]

    // 1. Convert from Strava format
    const rawInputs = stravaActivities
      .map(fromStravaActivity)
      .filter((a): a is RawActivityInput => a !== null)

    expect(rawInputs.length).toBe(7)

    // 2. Normalize
    const normalized = normalizeActivities(rawInputs)

    expect(normalized.length).toBe(7)
    normalized.forEach((activity) => {
      expect(activity.load).toBeGreaterThan(0)
      expect(activity.intensity).toBeGreaterThan(0)
      expect(activity.intensity).toBeLessThanOrEqual(1)
    })

    // 3. Compute Runstate
    const runstate = computeRunstate(normalized)

    expect(runstate).not.toBeNull()
    expect(runstate!.load).toBeGreaterThan(0)
    expect(runstate!.inputCount).toBe(7)

    // 4. Generate explanation
    const explanation = explainRunstate(runstate!)

    expect(explanation.summary).toBeTruthy()
    expect(explanation.loadContext).toBeTruthy()
    expect(explanation.trendContext).toBeTruthy()
    expect(explanation.balanceContext).toBeTruthy()

    // Log for visibility during development
    console.log('\n--- Full Pipeline Result ---')
    console.log('Runstate:', {
      load: runstate!.load,
      trend: runstate!.trend,
      baseline: runstate!.baseline,
      balance: runstate!.balance,
    })
    console.log('Explanation:', explanation)
  })
})
