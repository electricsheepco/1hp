# Runstate Engine — Module Specification

## Overview

Runstate is the intelligence layer that transforms activity data into unified physiological state. It treats the human body as one continuous system across all movement types.

**Location**: `/engine/runstate`

---

## Design Principles

| Principle | Meaning |
|-----------|---------|
| Deterministic | Same inputs always produce same outputs |
| Stateless | No module retains state between calls |
| Isolated | No imports from UI, analytics, or persistence |
| Versionable | Can be versioned (v1, v2) without breaking callers |
| Testable | All modules testable with pure functions |

---

## Module Structure

```
/engine/runstate
├── index.ts       # Public exports
├── types.ts       # Type definitions
├── inputs.ts      # External data acceptance
├── normalize.ts   # Unit normalization
├── compute.ts     # State computation
└── explain.ts     # Human-readable output
```

---

## Module Specifications

### 1. inputs.ts

**Purpose**: Accept minimal, sport-agnostic activity facts from any upstream source.

**Inputs**:
- Activity identifier
- Timestamp (start)
- Duration (elapsed, moving)
- Distance (optional)
- Elevation change (optional)
- Heart rate summary (optional)
- Power output (optional)
- Activity category

**Outputs**:
- Validated activity record
- Rejection signal for invalid inputs

**Does NOT**:
- Parse vendor-specific payloads
- Store or persist anything
- Infer missing fields
- Apply sport-specific logic
- Communicate with external APIs

---

### 2. normalize.ts

**Purpose**: Transform validated inputs into common internal representation.

**Inputs**:
- Validated activity record

**Outputs**:
- Normalized activity with:
  - Canonical duration (seconds)
  - Canonical distance (meters)
  - Canonical elevation (meters)
  - Intensity indicator (0–1)
  - Volume indicator (unitless)
  - Activity category (internal enum)

**Does NOT**:
- Compute cumulative state
- Compare activities to each other
- Apply time-decay or weighting
- Reference user history
- Produce load scores or trends

---

### 3. compute.ts

**Purpose**: Derive current physiological state from normalized activity history.

**Inputs**:
- Array of normalized activities
- Time window configuration
- Reference date

**Outputs**:
- Current load (cumulative stress indicator)
- Trend direction (rising, stable, falling)
- Personal baseline (historical reference)
- Cross-activity balance (distribution indicator)
- Metadata (window size, activity count, timestamp)

**Does NOT**:
- Reference sport names
- Output raw physiological units (TSS, TRIMP, HRV)
- Compare user to others
- Produce rankings
- Suggest actions
- Predict future states
- Reference goals or streaks

---

### 4. explain.ts

**Purpose**: Translate computed state into human-readable language.

**Inputs**:
- Computed Runstate result

**Outputs**:
- Summary sentence
- Load context
- Trend context
- Balance context

**Does NOT**:
- Prescribe rest or activity
- Use motivational language
- Use shaming language
- Reference performance or improvement
- Suggest training changes
- Include calls to action

---

## Boundary Matrix

| Layer | Knows | Never Knows |
|-------|-------|-------------|
| inputs | Raw activity shape | Vendor APIs, database, user identity |
| normalize | Single activity structure | Other activities, time, user history |
| compute | Normalized history | Sport names, UI, output usage |
| explain | Computed result | Actions to take, user goals |

---

## Configuration

```typescript
interface RunstateConfig {
  windowDays: number        // Default: 28 (4 weeks)
  minimumActivities: number // Default: 3
  baselineWindowDays: number // Default: 90 (3 months)
}
```

---

## Output Types

```typescript
interface RunstateResult {
  load: number           // Current cumulative load
  trend: TrendDirection  // 'rising' | 'stable' | 'falling'
  baseline: number       // Personal baseline reference
  balance: number        // -1 to 1 (run-heavy to cycle-heavy)
  inputWindow: number    // Days of data used
  inputCount: number     // Activities considered
  computedAt: Date
}

interface RunstateExplanation {
  summary: string        // One sentence overview
  loadContext: string    // What load means
  trendContext: string   // What trend indicates
  balanceContext: string // Balance interpretation
}
```

---

## Truths the Engine Holds

1. The body is one system across all movement types
2. Recent activity matters more than distant activity
3. Consistency is more meaningful than peaks
4. Absence of data is not absence of activity
5. The engine observes; it does not judge
