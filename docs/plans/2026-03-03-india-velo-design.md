# India Velo — Design Document

**Date:** 2026-03-03
**Status:** Approved

---

## What It Is

India Velo is a network of long-distance cycling routes across India — a fourth pillar within 1HP alongside Participate, Equip, and Measure. Routes are hybrid: 1HP defines and numbers them, informed by existing trails, roads, and established cycling paths.

**Core constraint:** No National Highways. Maximum road class is State Highway (SH). Routes prefer MDR, ODR, and VR. Road classes follow Indian classification: NH > SH > MDR > ODR > VR.

---

## Route Classification & Numbering

| Type | Code Format | Example | Description |
|------|-------------|---------|-------------|
| Grand | IV01–IV09 | IV01 | National corridors, cross-state |
| State | [STATE]01+ | KA01, MH01, GA01 | Within-state routes, sequential from 01 |

**Hierarchy:** Grand routes are composed of state segments. A state route belongs to a grand route but is also rideable as a standalone.

```
IV01  (grand route, coast-to-coast or similar)
  └── KA01  (Karnataka segment — standalone + part of IV01)
  └── GA01  (Goa segment — standalone + part of IV01)
  └── MH01  (Maharashtra segment — standalone + part of IV01)
```

State codes use the standard 2-letter alpha prefix (KA, MH, TN, KL, GJ, RJ, etc.).

---

## Information Architecture

**Nav:** Participate | Equip | Measure | India Velo

India Velo is a peer pillar, not a sub-section of Participate. It has its own identity and URL space.

**URLs:**
```
/routes                                           — India Velo index
/routes/iv01-western-coast                        — Grand route detail
/routes/ka01-karnataka-coast                      — State route detail
/routes/ka01-karnataka-coast/stage-3-mangalore-goa — Stage detail + community log
```

---

## Data Model

```
Route
  id
  code          — IV01 | KA01 | MH01 etc.
  name          — human name
  slug          — url-safe
  type          — 'grand' | 'state'
  description
  totalDistance — km
  states[]      — state codes the route passes through
  parentRoute?  — if state route, references grand route
  status        — 'proposed' | 'active'

Stage
  id
  routeId
  number        — sequential within route
  name
  slug
  startPoint    — place name
  endPoint      — place name
  distance      — km
  surface       — 'paved' | 'gravel' | 'mixed' | 'dirt'
  roadClass     — 'SH' | 'MDR' | 'ODR' | 'VR'  (no NH)
  notes         — road conditions, things to know

RiderLog
  id
  userId
  stageId
  completedAt
  note          — optional, max ~200 chars
```

---

## Pages

### `/routes` — India Velo Index
- Header: "India Velo" + descriptor ("Long-distance cycling routes across India. No highways.")
- Grand routes listed first (IV01–IV0X): total distance, states crossed, status
- State routes grouped/filterable by state
- Clean list layout, no map in v1

### `/routes/[slug]` — Route Detail
- Route code, name, total distance, states
- Grand route: shows constituent state segments
- State route: shows parent grand route
- Stage list with distance, surface, road class, start/end per stage
- Total rider count across all stages

### `/routes/[slug]/[stage-slug]` — Stage Detail
- Stage info: distance, surface, road class, start → end
- Notes on conditions and terrain
- Community log: mark as ridden + optional short note
- Recent notes from other riders (note text + month/year, no usernames)

---

## Community

**Auth:** Reuses existing Auth.js v5 + Strava OAuth from Runstate MVP. No new auth work.

**Marking a stage:**
- Logged-in user taps "Mark as ridden" on a stage page
- Optional note (plain text, ~200 char max)
- Multiple completions allowed (logs each separately)
- No delete from UI

**Visibility:**
- Stage page: notes from riders (text + month/year only, anonymous)
- Route page: rider count per stage
- Your own completed stages: quiet indicator on route page
- No streaks, no badges, no completion percentages, no social graph

---

## What This Is Not

- Not a turn-by-turn navigation tool
- Not a GPX download service (v1)
- Not a leaderboard or ranking system
- Not a route submission platform (1HP curates the network)
- No map in v1 (can add as a layer once content exists)

---

## Philosophy Alignment

India Velo follows the 1HP philosophy:
- Routes are for moving through India, not racing across it
- No NHs = deliberate choice to stay human-scale
- Community logs observe participation without ranking it
- Anonymous notes respect privacy and discourage performance posturing
