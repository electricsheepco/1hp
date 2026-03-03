# India Velo Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build India Velo as a fourth pillar in 1HP — a browseable, community-logged network of long-distance cycling routes across India.

**Architecture:** Server components for all read paths (index, route detail, stage detail). A single API route (`POST /api/routes/log`) handles authenticated stage logging. Auth reuses the existing Auth.js v5 + Strava setup. Prisma schema extended with Route, Stage, RiderLog models.

**Tech Stack:** Next.js 14 App Router, Prisma ORM (PostgreSQL), Auth.js v5, Tailwind CSS, shadcn/ui, Lucide React

---

## Context: How This Codebase Works

- **Root:** `/Volumes/zodlightning/sites/1hp/`
- **Web app:** `apps/web/src/`
- **Schema:** `prisma/schema.prisma` (shared, at root)
- **DB client:** `apps/web/src/lib/db.ts` — exports `db` (PrismaClient singleton)
- **Auth:** `apps/web/src/lib/auth.ts` — exports `auth`, `signIn`, `signOut`
- **Nav:** `apps/web/src/components/navigation.tsx` — array of `navItems`
- **Dev server:** `npm run dev` from `apps/web/` (port 3335)
- **DB commands:** run from repo root (`npm run db:push`, `npm run db:generate`)
- **Design doc:** `docs/plans/2026-03-03-india-velo-design.md`

---

## Task 1: Extend Prisma Schema

**Files:**
- Modify: `prisma/schema.prisma`

**Step 1: Add India Velo models to schema**

Append after the `RunstateSnapshot` model:

```prisma
// ============================================
// INDIA VELO (Routes)
// ============================================

enum RouteType {
  grand
  state
}

enum RouteStatus {
  proposed
  active
}

enum SurfaceType {
  paved
  gravel
  mixed
  dirt
}

enum RoadClass {
  SH
  MDR
  ODR
  VR
}

model Route {
  id            String      @id @default(cuid())
  code          String      @unique  // IV01, KA01, MH01 etc.
  name          String
  slug          String      @unique
  type          RouteType
  description   String?     @db.Text
  totalDistance Int?        // km
  states        String[]    // state codes e.g. ["KA", "GA", "MH"]
  parentRouteId String?
  status        RouteStatus @default(proposed)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  parentRoute   Route?      @relation("RouteHierarchy", fields: [parentRouteId], references: [id])
  childRoutes   Route[]     @relation("RouteHierarchy")
  stages        Stage[]

  @@index([type])
  @@index([status])
}

model Stage {
  id          String      @id @default(cuid())
  routeId     String
  number      Int
  name        String
  slug        String
  startPoint  String
  endPoint    String
  distance    Int         // km
  surface     SurfaceType @default(paved)
  roadClass   RoadClass   @default(MDR)
  notes       String?     @db.Text
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  route       Route       @relation(fields: [routeId], references: [id], onDelete: Cascade)
  riderLogs   RiderLog[]

  @@unique([routeId, number])
  @@unique([routeId, slug])
  @@index([routeId])
}

model RiderLog {
  id          String   @id @default(cuid())
  userId      String
  stageId     String
  completedAt DateTime @default(now())
  note        String?  @db.VarChar(200)

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  stage       Stage    @relation(fields: [stageId], references: [id], onDelete: Cascade)

  @@index([stageId])
  @@index([userId])
}
```

**Step 2: Add RiderLog relation to User model**

Find the `User` model in the schema. Add `riderLogs` to the relations:

```prisma
  riderLogs     RiderLog[]
```

(Add after the `runstates RunstateSnapshot[]` line.)

**Step 3: Push schema and generate client**

From repo root:
```bash
npm run db:push
npm run db:generate
```

Expected: Prisma confirms tables created, client regenerated with no errors.

**Step 4: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat(schema): add Route, Stage, RiderLog models for India Velo"
```

---

## Task 2: Seed Initial Routes

**Files:**
- Create: `prisma/seeds/india-velo.ts`
- Modify: `prisma/seed.ts` (create if it doesn't exist)

**Step 1: Check if seed file exists**

```bash
ls prisma/
```

If `seed.ts` doesn't exist, create it. If it does, read it first.

**Step 2: Create seed data**

Create `prisma/seeds/india-velo.ts`:

```typescript
import { PrismaClient, RouteType, RouteStatus, SurfaceType, RoadClass } from '@prisma/client'

export async function seedIndiaVelo(db: PrismaClient) {
  // Grand route: IV01 — West Coast Corridor
  // Mangalore → Panaji → Mumbai (coastal, SH/MDR only)
  const iv01 = await db.route.upsert({
    where: { code: 'IV01' },
    update: {},
    create: {
      code: 'IV01',
      name: 'West Coast Corridor',
      slug: 'iv01-west-coast-corridor',
      type: RouteType.grand,
      description: 'A long-distance cycling route along India\'s western coastline, connecting Mangalore to Mumbai through Goa. Follows coastal state highways and district roads, avoiding national highways throughout.',
      totalDistance: 840,
      states: ['KA', 'GA', 'MH'],
      status: RouteStatus.active,
    },
  })

  // State route: KA01 — Karnataka Coast
  const ka01 = await db.route.upsert({
    where: { code: 'KA01' },
    update: {},
    create: {
      code: 'KA01',
      name: 'Karnataka Coast',
      slug: 'ka01-karnataka-coast',
      type: RouteType.state,
      description: 'The Karnataka segment of IV01. Follows the Konkan coast from Mangalore to Karwar, mostly on MDR and SH-66.',
      totalDistance: 260,
      states: ['KA'],
      status: RouteStatus.active,
      parentRouteId: iv01.id,
    },
  })

  // Stages for KA01
  const ka01Stages = [
    {
      number: 1,
      name: 'Mangalore to Udupi',
      slug: 'stage-1-mangalore-udupi',
      startPoint: 'Mangalore',
      endPoint: 'Udupi',
      distance: 58,
      surface: SurfaceType.paved,
      roadClass: RoadClass.SH,
      notes: 'Follows SH-66 for most of the route. Coastal road with moderate traffic. Beach diversions available near Malpe.',
    },
    {
      number: 2,
      name: 'Udupi to Kumta',
      slug: 'stage-2-udupi-kumta',
      startPoint: 'Udupi',
      endPoint: 'Kumta',
      distance: 72,
      surface: SurfaceType.mixed,
      roadClass: RoadClass.MDR,
      notes: 'Mix of SH-66 and MDR. The stretch between Byndoor and Shirali is quiet district road with good surface. Passes through Jog Falls area.',
    },
    {
      number: 3,
      name: 'Kumta to Karwar',
      slug: 'stage-3-kumta-karwar',
      startPoint: 'Kumta',
      endPoint: 'Karwar',
      distance: 65,
      surface: SurfaceType.paved,
      roadClass: RoadClass.MDR,
      notes: 'Quiet coastal MDR. Passes through Gokarna — allow extra time. Good road surface throughout. No NH contact on this stage.',
    },
  ]

  for (const stage of ka01Stages) {
    await db.stage.upsert({
      where: { routeId_slug: { routeId: ka01.id, slug: stage.slug } },
      update: {},
      create: { routeId: ka01.id, ...stage },
    })
  }

  // State route: GA01 — Goa Coast
  const ga01 = await db.route.upsert({
    where: { code: 'GA01' },
    update: {},
    create: {
      code: 'GA01',
      name: 'Goa Coast',
      slug: 'ga01-goa-coast',
      type: RouteType.state,
      description: 'The Goa segment of IV01. Crosses Goa from Karwar border to the Maharashtra border near Patradevi, using state highways and district roads.',
      totalDistance: 120,
      states: ['GA'],
      status: RouteStatus.active,
      parentRouteId: iv01.id,
    },
  })

  const ga01Stages = [
    {
      number: 1,
      name: 'Karwar to Panaji',
      slug: 'stage-1-karwar-panaji',
      startPoint: 'Karwar (KA border)',
      endPoint: 'Panaji',
      distance: 60,
      surface: SurfaceType.paved,
      roadClass: RoadClass.SH,
      notes: 'Enters Goa at Karwar. Follows SH-60 inland, then coastal roads to Panaji. Avoid the bridge bypass — take the old MDR for a quieter entry into the city.',
    },
    {
      number: 2,
      name: 'Panaji to Patradevi',
      slug: 'stage-2-panaji-patradevi',
      startPoint: 'Panaji',
      endPoint: 'Patradevi (MH border)',
      distance: 60,
      surface: SurfaceType.paved,
      roadClass: RoadClass.SH,
      notes: 'North Goa coastal route. SH-5 with sections on MDR near Calangute and Arambol. Border crossing at Patradevi is straightforward.',
    },
  ]

  for (const stage of ga01Stages) {
    await db.stage.upsert({
      where: { routeId_slug: { routeId: ga01.id, slug: stage.slug } },
      update: {},
      create: { routeId: ga01.id, ...stage },
    })
  }

  console.log('India Velo seed complete: IV01, KA01, GA01')
}
```

**Step 3: Create or update prisma/seed.ts**

If `prisma/seed.ts` doesn't exist:

```typescript
import { PrismaClient } from '@prisma/client'
import { seedIndiaVelo } from './seeds/india-velo'

const db = new PrismaClient()

async function main() {
  await seedIndiaVelo(db)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
```

If it exists, add the `seedIndiaVelo` import and call.

**Step 4: Ensure seed script is configured in package.json**

In the root `package.json`, check for a `prisma.seed` field. It should look like:
```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

If missing, add it. Check what ts runner is already configured (ts-node, tsx, etc.).

**Step 5: Run seed**

```bash
npm run db:seed
```

Expected: "India Velo seed complete: IV01, KA01, GA01"

**Step 6: Commit**

```bash
git add prisma/seeds/india-velo.ts prisma/seed.ts package.json
git commit -m "feat(seed): add India Velo initial routes (IV01, KA01, GA01)"
```

---

## Task 3: Add India Velo to Navigation

**Files:**
- Modify: `apps/web/src/components/navigation.tsx:9-13`

**Step 1: Add route to navItems array**

Find `const navItems` at line 9. Add the India Velo entry:

```typescript
const navItems = [
  { href: '/participate', label: 'Participate' },
  { href: '/equip', label: 'Equip' },
  { href: '/runstate', label: 'Measure' },
  { href: '/routes', label: 'India Velo' },
]
```

**Step 2: Verify in browser**

Start dev server (`npm run dev` from `apps/web/`) and check that "India Velo" appears in the nav on desktop and in the mobile drawer.

**Step 3: Commit**

```bash
git add apps/web/src/components/navigation.tsx
git commit -m "feat(nav): add India Velo as fourth pillar"
```

---

## Task 4: India Velo Index Page (`/routes`)

**Files:**
- Create: `apps/web/src/app/routes/page.tsx`

**Step 1: Create the page**

This is a server component. It fetches all routes from the DB and renders them.

```typescript
import { db } from '@/lib/db'
import Link from 'next/link'
import { MapPin, ChevronRight } from 'lucide-react'
import type { Route } from '@prisma/client'

function RouteStatusBadge({ status }: { status: Route['status'] }) {
  if (status === 'active') return null
  return (
    <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border rounded px-1.5 py-0.5">
      proposed
    </span>
  )
}

function RouteCard({ route }: { route: Route }) {
  return (
    <Link
      href={`/routes/${route.slug}`}
      className="group flex items-center gap-4 p-4 rounded-xl border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-200"
    >
      <div className="flex-shrink-0 w-14 text-center">
        <span className="text-xs font-mono font-medium text-muted-foreground group-hover:text-primary transition-colors">
          {route.code}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium group-hover:text-primary transition-colors">
            {route.name}
          </h3>
          <RouteStatusBadge status={route.status} />
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {route.states.join(' · ')}
          </span>
          {route.totalDistance && (
            <span className="text-xs text-muted-foreground">
              {route.totalDistance} km
            </span>
          )}
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
    </Link>
  )
}

export default async function RoutesPage() {
  const [grandRoutes, stateRoutes] = await Promise.all([
    db.route.findMany({
      where: { type: 'grand' },
      orderBy: { code: 'asc' },
    }),
    db.route.findMany({
      where: { type: 'state' },
      orderBy: { code: 'asc' },
    }),
  ])

  // Group state routes by first 2 chars of code (state prefix)
  const stateGroups: Record<string, typeof stateRoutes> = {}
  for (const route of stateRoutes) {
    const prefix = route.code.slice(0, 2)
    if (!stateGroups[prefix]) stateGroups[prefix] = []
    stateGroups[prefix].push(route)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-light tracking-tight mb-2">India Velo</h1>
          <p className="text-lg text-muted-foreground">
            Long-distance cycling routes across India. No highways.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Grand routes */}
        {grandRoutes.length > 0 && (
          <section>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Grand Routes
            </h2>
            <div className="space-y-1">
              {grandRoutes.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          </section>
        )}

        {/* State routes grouped */}
        {Object.keys(stateGroups).length > 0 && (
          <section>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
              State Routes
            </h2>
            <div className="space-y-6">
              {Object.entries(stateGroups).map(([state, routes]) => (
                <div key={state}>
                  <p className="text-xs text-muted-foreground font-mono mb-2">{state}</p>
                  <div className="space-y-1">
                    {routes.map((route) => (
                      <RouteCard key={route.id} route={route} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {grandRoutes.length === 0 && stateRoutes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No routes yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
```

**Step 2: Test in browser**

Navigate to `http://localhost:3335/routes`. Should show IV01 in Grand Routes, KA01 and GA01 in State Routes under "KA" and "GA" groups.

**Step 3: Commit**

```bash
git add apps/web/src/app/routes/page.tsx
git commit -m "feat(routes): add India Velo index page"
```

---

## Task 5: Route Detail Page (`/routes/[slug]`)

**Files:**
- Create: `apps/web/src/app/routes/[slug]/page.tsx`

**Step 1: Create route detail page**

```typescript
import { db } from '@/lib/db'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, MapPin, ArrowLeft } from 'lucide-react'
import { SurfaceType, RoadClass } from '@prisma/client'

const surfaceLabel: Record<SurfaceType, string> = {
  paved: 'Paved',
  gravel: 'Gravel',
  mixed: 'Mixed',
  dirt: 'Dirt',
}

const roadClassLabel: Record<RoadClass, string> = {
  SH: 'State Highway',
  MDR: 'Major District Road',
  ODR: 'District Road',
  VR: 'Village Road',
}

export default async function RouteDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const route = await db.route.findUnique({
    where: { slug: params.slug },
    include: {
      stages: {
        orderBy: { number: 'asc' },
        include: {
          _count: { select: { riderLogs: true } },
        },
      },
      parentRoute: true,
      childRoutes: {
        orderBy: { code: 'asc' },
      },
    },
  })

  if (!route) notFound()

  const totalRiders = route.stages.reduce(
    (sum, stage) => sum + stage._count.riderLogs,
    0
  )

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 py-12">
          <Link
            href="/routes"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            India Velo
          </Link>
          <div className="flex items-start gap-4">
            <span className="font-mono text-sm text-muted-foreground mt-1">{route.code}</span>
            <div>
              <h1 className="text-4xl font-light tracking-tight mb-2">{route.name}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {route.states.join(' · ')}
                </span>
                {route.totalDistance && (
                  <span>{route.totalDistance} km total</span>
                )}
                {totalRiders > 0 && (
                  <span>{totalRiders} stage logs</span>
                )}
              </div>
            </div>
          </div>
          {route.description && (
            <p className="mt-4 text-muted-foreground max-w-2xl leading-relaxed">
              {route.description}
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-10">
        {/* Parent route link */}
        {route.parentRoute && (
          <div className="text-sm text-muted-foreground">
            Part of{' '}
            <Link
              href={`/routes/${route.parentRoute.slug}`}
              className="text-foreground hover:text-primary transition-colors underline underline-offset-2"
            >
              {route.parentRoute.code} — {route.parentRoute.name}
            </Link>
          </div>
        )}

        {/* Child routes (if grand route) */}
        {route.childRoutes.length > 0 && (
          <section>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
              State Segments
            </h2>
            <div className="space-y-1">
              {route.childRoutes.map((child) => (
                <Link
                  key={child.id}
                  href={`/routes/${child.slug}`}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-200"
                >
                  <span className="font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors w-12">
                    {child.code}
                  </span>
                  <span className="flex-1 font-medium group-hover:text-primary transition-colors">
                    {child.name}
                  </span>
                  {child.totalDistance && (
                    <span className="text-sm text-muted-foreground">{child.totalDistance} km</span>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Stages */}
        {route.stages.length > 0 && (
          <section>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Stages
            </h2>
            <div className="space-y-1">
              {route.stages.map((stage) => (
                <Link
                  key={stage.id}
                  href={`/routes/${route.slug}/${stage.slug}`}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-200"
                >
                  <div className="flex-shrink-0 w-8 text-center">
                    <span className="text-sm font-light text-muted-foreground">{stage.number}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium group-hover:text-primary transition-colors">
                      {stage.startPoint} → {stage.endPoint}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-muted-foreground">{stage.distance} km</span>
                      <span className="text-xs text-muted-foreground">{surfaceLabel[stage.surface]}</span>
                      <span className="text-xs text-muted-foreground">{roadClassLabel[stage.roadClass]}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {stage._count.riderLogs > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {stage._count.riderLogs} logged
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
```

**Step 2: Test in browser**

Navigate to `http://localhost:3335/routes/iv01-west-coast-corridor`. Should show grand route with KA01 and GA01 as state segments, no stages list (grand route has none directly).

Navigate to `http://localhost:3335/routes/ka01-karnataka-coast`. Should show parent link to IV01, 3 stages.

**Step 3: Commit**

```bash
git add apps/web/src/app/routes/[slug]/page.tsx
git commit -m "feat(routes): add route detail page"
```

---

## Task 6: Stage Detail Page (`/routes/[slug]/[stage-slug]`)

**Files:**
- Create: `apps/web/src/app/routes/[slug]/[stage-slug]/page.tsx`
- Create: `apps/web/src/app/routes/[slug]/[stage-slug]/log-ride-form.tsx`

**Step 1: Create the log ride form (client component)**

Create `apps/web/src/app/routes/[slug]/[stage-slug]/log-ride-form.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface LogRideFormProps {
  stageId: string
  isSignedIn: boolean
  callbackUrl: string
}

export function LogRideForm({ stageId, isSignedIn, callbackUrl }: LogRideFormProps) {
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  if (!isSignedIn) {
    return (
      <div className="p-4 rounded-xl border border-border/50 bg-muted/20">
        <p className="text-sm text-muted-foreground mb-3">Sign in to log this stage.</p>
        <a
          href={`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
        >
          Sign in with Strava
        </a>
      </div>
    )
  }

  if (done) {
    return (
      <div className="p-4 rounded-xl border border-border/50 bg-primary/5">
        <p className="text-sm text-muted-foreground">Logged.</p>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/routes/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stageId, note: note.trim() || null }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to log ride')
      }

      setDone(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="note" className="block text-sm text-muted-foreground mb-1.5">
          Note (optional)
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 200))}
          placeholder="Road conditions, detours, things to know..."
          rows={3}
          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground/50"
        />
        <p className="text-xs text-muted-foreground mt-1 text-right">{note.length}/200</p>
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 text-sm font-medium bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50"
      >
        {submitting ? 'Logging...' : 'Mark as ridden'}
      </button>
    </form>
  )
}
```

**Step 2: Create the stage detail page**

Create `apps/web/src/app/routes/[slug]/[stage-slug]/page.tsx`:

```typescript
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SurfaceType, RoadClass } from '@prisma/client'
import { LogRideForm } from './log-ride-form'

const surfaceLabel: Record<SurfaceType, string> = {
  paved: 'Paved',
  gravel: 'Gravel',
  mixed: 'Mixed',
  dirt: 'Dirt',
}

const roadClassLabel: Record<RoadClass, string> = {
  SH: 'State Highway',
  MDR: 'Major District Road',
  ODR: 'District Road',
  VR: 'Village Road',
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

export default async function StageDetailPage({
  params,
}: {
  params: { slug: string; 'stage-slug': string }
}) {
  const stageSlug = params['stage-slug']

  const route = await db.route.findUnique({
    where: { slug: params.slug },
  })

  if (!route) notFound()

  const stage = await db.stage.findUnique({
    where: { routeId_slug: { routeId: route.id, slug: stageSlug } },
    include: {
      riderLogs: {
        where: { note: { not: null } },
        orderBy: { completedAt: 'desc' },
        take: 20,
        select: {
          note: true,
          completedAt: true,
        },
      },
      _count: { select: { riderLogs: true } },
    },
  })

  if (!stage) notFound()

  const session = await auth()
  const callbackUrl = `/routes/${params.slug}/${stageSlug}`

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 py-12">
          <Link
            href={`/routes/${route.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {route.code} — {route.name}
          </Link>
          <div className="flex items-start gap-3">
            <span className="font-light text-muted-foreground mt-1.5">Stage {stage.number}</span>
            <div>
              <h1 className="text-4xl font-light tracking-tight mb-2">
                {stage.startPoint} → {stage.endPoint}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span>{stage.distance} km</span>
                <span>{surfaceLabel[stage.surface]}</span>
                <span>{roadClassLabel[stage.roadClass]}</span>
                {stage._count.riderLogs > 0 && (
                  <span>{stage._count.riderLogs} people have ridden this</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-10">
        {/* Notes */}
        {stage.notes && (
          <section>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Notes
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">{stage.notes}</p>
          </section>
        )}

        {/* Log ride */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Log this stage
          </h2>
          <LogRideForm
            stageId={stage.id}
            isSignedIn={!!session?.user?.id}
            callbackUrl={callbackUrl}
          />
        </section>

        {/* Rider logs */}
        {stage.riderLogs.length > 0 && (
          <section>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              From riders
            </h2>
            <div className="space-y-3">
              {stage.riderLogs.map((log, i) => (
                <div key={i} className="p-4 rounded-xl bg-muted/20 border border-border/50">
                  <p className="text-sm">{log.note}</p>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {formatMonthYear(log.completedAt)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
```

**Step 3: Test in browser**

Navigate to `http://localhost:3335/routes/ka01-karnataka-coast/stage-1-mangalore-udupi`.

- If not signed in: should show "Sign in to log this stage" with a Strava sign-in link
- Stage info, notes, and road class should be visible
- No rider logs yet (empty section)

**Step 4: Commit**

```bash
git add apps/web/src/app/routes/[slug]/[stage-slug]/page.tsx
git add apps/web/src/app/routes/[slug]/[stage-slug]/log-ride-form.tsx
git commit -m "feat(routes): add stage detail page with log-ride form"
```

---

## Task 7: API Route — Mark Stage as Ridden

**Files:**
- Create: `apps/web/src/app/api/routes/log/route.ts`

**Step 1: Create the API handler**

```typescript
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { stageId, note } = body

    if (!stageId || typeof stageId !== 'string') {
      return NextResponse.json({ error: 'stageId required' }, { status: 400 })
    }

    // Verify stage exists
    const stage = await db.stage.findUnique({ where: { id: stageId } })
    if (!stage) {
      return NextResponse.json({ error: 'Stage not found' }, { status: 404 })
    }

    // Validate note length
    const cleanNote = note && typeof note === 'string' ? note.trim().slice(0, 200) : null

    const log = await db.riderLog.create({
      data: {
        userId: session.user.id,
        stageId,
        note: cleanNote || null,
      },
    })

    return NextResponse.json({ id: log.id }, { status: 201 })
  } catch (error) {
    console.error('RiderLog creation error:', error)
    return NextResponse.json({ error: 'Failed to log ride' }, { status: 500 })
  }
}
```

**Step 2: Test the endpoint manually**

With the dev server running and signed in via Strava, use the stage page UI to mark a stage as ridden. Or test via curl (requires a valid session cookie).

Alternatively, open DevTools → Application → Cookies and grab the session cookie, then:

```bash
curl -X POST http://localhost:3335/api/routes/log \
  -H "Content-Type: application/json" \
  -H "Cookie: [your session cookie]" \
  -d '{"stageId": "[actual stage id from DB]", "note": "Test note"}'
```

Expected: `{"id": "..."}` with status 201.

**Step 3: Test the full flow in browser**

1. Sign in via Strava at `/runstate`
2. Navigate to `/routes/ka01-karnataka-coast/stage-1-mangalore-udupi`
3. Enter a note and click "Mark as ridden"
4. Should show "Logged." confirmation
5. Refresh page — rider log should appear in "From riders" section

**Step 4: Commit**

```bash
git add apps/web/src/app/api/routes/log/route.ts
git commit -m "feat(api): add POST /api/routes/log for stage ride logging"
```

---

## Task 8: Add `generateMetadata` to Route Pages

**Files:**
- Modify: `apps/web/src/app/routes/[slug]/page.tsx`
- Modify: `apps/web/src/app/routes/[slug]/[stage-slug]/page.tsx`

**Step 1: Add metadata to route detail page**

In `apps/web/src/app/routes/[slug]/page.tsx`, add before the default export:

```typescript
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const route = await db.route.findUnique({ where: { slug: params.slug } })
  if (!route) return {}
  return {
    title: `${route.code} — ${route.name} | India Velo`,
    description: route.description ?? `${route.totalDistance}km cycling route through ${route.states.join(', ')}`,
  }
}
```

**Step 2: Add metadata to stage detail page**

In `apps/web/src/app/routes/[slug]/[stage-slug]/page.tsx`, add before the default export:

```typescript
export async function generateMetadata({
  params,
}: {
  params: { slug: string; 'stage-slug': string }
}) {
  const route = await db.route.findUnique({ where: { slug: params.slug } })
  if (!route) return {}
  const stage = await db.stage.findUnique({
    where: { routeId_slug: { routeId: route.id, slug: params['stage-slug'] } },
  })
  if (!stage) return {}
  return {
    title: `Stage ${stage.number}: ${stage.startPoint} → ${stage.endPoint} | ${route.code}`,
    description: `${stage.distance}km on ${stage.roadClass}. ${stage.notes ?? ''}`.trim(),
  }
}
```

**Step 3: Commit**

```bash
git add apps/web/src/app/routes/[slug]/page.tsx
git add apps/web/src/app/routes/[slug]/[stage-slug]/page.tsx
git commit -m "feat(routes): add generateMetadata for route and stage pages"
```

---

## Task 9: Update Footer

**Files:**
- Modify: `apps/web/src/components/footer.tsx`

**Step 1: Read the footer first**

Read `apps/web/src/components/footer.tsx` to understand current structure.

**Step 2: Add India Velo link**

Find where the nav links are listed (Participate, Equip, Measure) and add India Velo to match.

**Step 3: Commit**

```bash
git add apps/web/src/components/footer.tsx
git commit -m "feat(footer): add India Velo link"
```

---

## Task 10: Final Verification

**Step 1: Build check**

```bash
npm run build
```

Expected: no TypeScript errors, no build failures.

**Step 2: Lint**

```bash
npm run lint
```

Expected: no errors.

**Step 3: Manual test checklist**

- [ ] `/routes` — index loads, grand and state routes visible
- [ ] `/routes/iv01-west-coast-corridor` — grand route, child routes listed
- [ ] `/routes/ka01-karnataka-coast` — state route, parent link, 3 stages listed
- [ ] `/routes/ka01-karnataka-coast/stage-1-mangalore-udupi` — stage detail, notes, log form
- [ ] Not signed in: log form shows Strava sign-in link
- [ ] Signed in: can submit note, "Logged." confirmation appears
- [ ] After logging: note appears in "From riders"
- [ ] Nav shows "India Velo" on all pages
- [ ] 404 on invalid slug: `/routes/does-not-exist`

**Step 4: Final commit if any cleanup needed**

```bash
git commit -m "fix: india velo post-build cleanup"
```

---

## Notes

- **No NH**: enforced by enum — `RoadClass` has no `NH` value. Any attempt to insert NH data will fail at the schema level.
- **Auth redirect**: sign-in links pass `callbackUrl` so users return to the stage page after Strava auth.
- **Anonymous logs**: rider logs display note + month/year only. No userId exposed to frontend.
- **Multiple completions**: the API creates a new RiderLog each time. No deduplication by design.
- **Map**: not in this implementation. Can be added later as a layer on route/stage pages once GPX data exists.
