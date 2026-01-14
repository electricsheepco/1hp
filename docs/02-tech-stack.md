# 1HP — Tech Stack & Architecture

## Approved Stack (Non-Negotiable)

### Frontend

| Technology | Purpose | Notes |
|------------|---------|-------|
| Next.js | Framework | App Router only |
| TypeScript | Language | Strict mode ON |
| Tailwind CSS | Styling | Semantic tokens |
| Radix UI | Components | Primitives only |
| Lucide Icons | Icons | Consistent iconography |

### Backend

| Technology | Purpose | Notes |
|------------|---------|-------|
| Node.js | Runtime | LTS version |
| PostgreSQL | Database | Primary data store |
| Prisma | ORM | Type-safe queries |
| tRPC or REST | API | Explicit, no magic |

### Services

| Technology | Purpose | Notes |
|------------|---------|-------|
| PostHog | Analytics | Product analytics ONLY |
| Stripe | Payments | Store transactions |
| Auth.js | Authentication | Email-first |
| Strava API | Data ingestion | v1 input source |

### Hosting

| Technology | Purpose |
|------------|---------|
| Vercel | Frontend hosting |
| Neon / Supabase / RDS | Managed PostgreSQL |

---

## Architecture Principles

### Separation of Concerns

The system has three distinct domains that must not couple:

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Participate │  │    Equip    │  │  Runstate   │
│   (Events)  │  │   (Store)   │  │ (Understand)│
└─────────────┘  └─────────────┘  └─────────────┘
       │                │                │
       └────────────────┴────────────────┘
                        │
                  Shared Auth Only
```

### Runstate Engine Isolation

The Runstate computation engine lives in `/engine/runstate` and must:

- Contain NO UI logic
- Contain NO API logic
- Contain NO analytics logic
- Be testable without database or network

### Data Flow

```
External Source (Strava)
         │
         ▼
    ┌─────────┐
    │ Ingest  │  ← Vendor-specific adapters
    └────┬────┘
         │
         ▼
    ┌─────────┐
    │  Store  │  ← Raw data in PostgreSQL
    └────┬────┘
         │
         ▼
┌─────────────────┐
│ Runstate Engine │  ← Pure computation
└────────┬────────┘
         │
         ▼
    ┌─────────┐
    │   UI    │  ← Display only
    └─────────┘
```

---

## PostHog Guardrails

### Allowed

- Feature usage tracking
- UX friction detection
- Funnel understanding (Discover → Understand → Equip)

### Forbidden

- Tracking physiological values
- Tracking Runstate metric values
- Individual performance analysis
- Engagement optimisation
- Behaviour nudging
- Heatmaps on Runstate screens
- A/B testing Runstate meaning

### Allowed Events

```typescript
// Participate
'event_discovered'
'event_saved'
'event_unsaved'

// Equip
'store_product_viewed'
'store_checkout_started'
'store_checkout_completed'

// Runstate
'runstate_viewed'
'runstate_explanation_opened'

// Connection
'data_source_connected'
'data_source_disconnected'
```

### Forbidden Events

- Any event containing load, trend, baseline, or balance values
- Any event tracking "high performers" or "power users"
- Any event correlating activity with engagement

---

## Privacy Principle

> User performance data is NEVER used for engagement analytics.
> Product analytics track interaction, not the body.

This is explicit in system design and enforced at the API level.
