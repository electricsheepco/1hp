# 1HP — Development Guide

## Prerequisites

- Node.js (LTS)
- npm
- PostgreSQL (for full functionality)

---

## Getting Started

### 1. Clone and Install

```bash
cd /path/to/1hp
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Configure required variables:

```env
# Database (required for full functionality)
DATABASE_URL="postgresql://user:password@localhost:5432/1hp"

# Auth (required for authentication)
NEXTAUTH_SECRET="generate-a-secure-secret"
NEXTAUTH_URL="http://localhost:3335"

# Optional services
STRAVA_CLIENT_ID=""
STRAVA_CLIENT_SECRET=""
NEXT_PUBLIC_POSTHOG_KEY=""
STRIPE_SECRET_KEY=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
```

### 3. Run Development Server

```bash
npm run dev
```

The app runs at **http://localhost:3335**

---

## Available Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start development server (port 3335) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Prisma Studio |

---

## Project URLs

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/participate` | Events (Participate pillar) |
| `/equip` | Store (Equip pillar) |
| `/runstate` | Intelligence (Understand pillar) |

---

## Development Workflow

### Making Changes

1. Create a branch for your work
2. Make changes in the appropriate directory
3. Test locally with `npm run dev`
4. Run `npm run build` to verify no build errors
5. Submit for review

### Code Quality

- TypeScript strict mode is enabled
- ESLint is configured
- Follow existing patterns in the codebase

---

## Architecture Reminders

### Engine Isolation

The Runstate engine (`/engine/runstate`) must never import:
- UI components
- API handlers
- Analytics
- Database clients

### Analytics Guardrails

When adding PostHog events:
- Never track physiological values
- Never track Runstate metrics
- Only track interaction events

### Pillar Independence

The three pillars (`participate`, `equip`, `runstate`) must not depend on each other. Shared code goes in:
- `components/` for UI
- `lib/` for utilities

---

## Database Setup (When Ready)

### Using Neon

1. Create a Neon project at neon.tech
2. Copy the connection string to `.env`
3. Run migrations:

```bash
npm run db:push
```

### Using Supabase

1. Create a Supabase project
2. Get the connection string from Settings → Database
3. Add to `.env` as `DATABASE_URL`
4. Run migrations:

```bash
npm run db:push
```

---

## Troubleshooting

### Port Already in Use

If port 3335 is busy:

```bash
lsof -i :3335
kill -9 <PID>
```

### Prisma Client Issues

Regenerate the client:

```bash
npm run db:generate
```

### Type Errors

Ensure strict mode is on in all `tsconfig.json` files. Run:

```bash
npm run build
```

to see all type errors.

---

## Design Guidelines

When building UI:

- One idea per screen
- No dopamine loops
- Calm over clever
- Typography over decoration
- No charts as hero elements
- No celebratory or shaming language

Reference the [Philosophy doc](./01-philosophy.md) for language guidelines.
