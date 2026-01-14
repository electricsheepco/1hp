# 1HP — Folder Structure & Boundaries

## Repository Structure

```
/1hp
├── apps/
│   └── web/                    # Next.js application
│       ├── src/
│       │   ├── app/            # App Router pages
│       │   │   ├── page.tsx           # Landing page
│       │   │   ├── layout.tsx         # Root layout
│       │   │   ├── globals.css        # Global styles
│       │   │   ├── participate/       # Events pillar
│       │   │   │   └── page.tsx
│       │   │   ├── equip/             # Store pillar
│       │   │   │   └── page.tsx
│       │   │   └── runstate/          # Understand pillar
│       │   │       └── page.tsx
│       │   ├── components/     # Shared UI components
│       │   │   └── navigation.tsx
│       │   └── lib/            # Utilities
│       │       └── utils.ts
│       ├── public/             # Static assets
│       ├── package.json
│       ├── tsconfig.json
│       ├── tailwind.config.ts
│       ├── postcss.config.js
│       └── next.config.js
│
├── engine/
│   └── runstate/               # Computation engine (ISOLATED)
│       ├── index.ts            # Public exports
│       ├── types.ts            # Type definitions
│       ├── inputs.ts           # Input validation
│       ├── normalize.ts        # Normalization
│       ├── compute.ts          # State computation
│       ├── explain.ts          # Human-readable output
│       ├── package.json
│       └── tsconfig.json
│
├── analytics/                  # Product analytics (GUARDRAILED)
│   ├── index.ts                # Public exports
│   ├── posthog.ts              # PostHog integration
│   ├── package.json
│   └── tsconfig.json
│
├── prisma/
│   └── schema.prisma           # Database schema
│
├── docs/                       # Documentation
│   ├── 00-overview.md
│   ├── 01-philosophy.md
│   ├── 02-tech-stack.md
│   ├── 03-runstate-engine.md
│   ├── 04-folder-structure.md
│   └── 05-development.md
│
├── package.json                # Root workspace config
├── package-lock.json
├── .gitignore
└── .env.example
```

---

## Naming Conventions

### Pillars vs Routes vs Labels

| Concept | Pillar Name | Route | Nav Label |
|---------|-------------|-------|-----------|
| Events | Participate | `/participate` | Participate |
| Store | Equip | `/equip` | Equip |
| Intelligence | Understand | `/runstate` | Understand |

**Rule**: "Understand" is a UX concept. "Runstate" is the system name. Code uses `runstate`.

### File Naming

- Components: `kebab-case.tsx`
- Utilities: `kebab-case.ts`
- Types: `PascalCase` for types, `camelCase` for variables
- Routes: lowercase directories matching URL segments

---

## Boundary Rules

### What Each Directory Can Import

| Directory | Can Import From | Cannot Import From |
|-----------|-----------------|-------------------|
| `apps/web` | `engine/*`, `analytics` | — |
| `engine/runstate` | Nothing external | `apps/*`, `analytics`, `prisma` |
| `analytics` | Nothing external | `apps/*`, `engine/*`, `prisma` |

### Critical Boundaries

```
┌──────────────────────────────────────────────────────────┐
│                        apps/web                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│  │ participate │  │   equip    │  │  runstate  │         │
│  └────────────┘  └────────────┘  └────────────┘         │
│         │               │               │                │
│         └───────────────┴───────────────┘                │
│                         │                                │
│                   NO COUPLING                            │
│                   BETWEEN PILLARS                        │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                    engine/runstate                       │
│                                                          │
│   ISOLATED: No UI, No API, No Analytics, No Database     │
│                                                          │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                       analytics                          │
│                                                          │
│   GUARDRAILED: Interaction only, never body data         │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Workspace Configuration

The project uses npm workspaces:

```json
{
  "workspaces": [
    "apps/*",
    "engine/*",
    "analytics"
  ]
}
```

### Package Names

| Package | Name |
|---------|------|
| Web app | `@1hp/web` |
| Runstate engine | `@1hp/runstate` |
| Analytics | `@1hp/analytics` |

---

## Adding New Code

### New Route

1. Create directory in `apps/web/src/app/`
2. Add `page.tsx` with placeholder
3. Update navigation if needed

### New Component

1. Create file in `apps/web/src/components/`
2. Use kebab-case naming
3. Export from component file directly

### New Engine Logic

1. Add to existing module in `engine/runstate/`
2. Export from `index.ts`
3. Ensure no external imports
4. Add tests

### New Analytics Event

1. Check against guardrails (no body data)
2. Add to `analytics/posthog.ts`
3. Export from `analytics/index.ts`
4. Document allowed context
