# CLAUDE.md — 1HP

## Project Overview

**1HP — One Human Powered**

A platform for human-powered movement (running, walking, cycling, swimming, triathlons). Treats the human body as one continuous system rather than separate sport silos.

**Domain**: 1HP.in

## Philosophy (Non-Negotiable)

- Movement is not a competition by default
- The body is not a machine to be optimised
- Consistency matters more than extremes
- Walking counts. Rest counts. Aging counts. Returning counts.

**Language to avoid**: grind, hustle, crush, peak, PR, beast, optimisation, domination

**Tone**: Calm, adult, respectful, unimpressed by extremes

## Architecture

```
1hp/
├── apps/
│   ├── web/          # Next.js 14 frontend (port 3335)
│   └── video/        # Remotion video generation
├── engine/           # Business logic (planned)
├── analytics/        # Analytics module
├── prisma/           # Database schema
└── docs/             # Project documentation
```

## The Three Pillars

| Pillar | Route | Purpose |
|--------|-------|---------|
| Participate | `/participate` | Find human-powered events |
| Equip | `/equip` | Gear that lasts |
| Measure | `/runstate` | Know where you are (Runstate) |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v3, shadcn/ui, Radix UI
- **Font**: Sora (Google Fonts)
- **Icons**: Lucide React
- **Illustrations**: unDraw (CC0-style licence)
- **Video**: Remotion (social media content)
- **Database**: Prisma (not yet connected)
- **Hosting**: Vercel

## Brand Colours

```css
--primary: hsl(14, 55%, 52%)  /* #C96442 terracotta */
--background: hsl(48, 33%, 97%)  /* warm cream */
--foreground: hsl(45, 22%, 20%)  /* dark brown */
```

## Commands

```bash
# Web development
npm run dev              # Start web app (port 3335)
npm run build            # Production build
npm run lint             # ESLint

# Video generation
npm run video:dev        # Remotion Studio (port 3002)
npm run video:render:post   # Render 1:1 post
npm run video:render:reel   # Render 9:16 reel

# Database (when connected)
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema
npm run db:studio        # Prisma Studio
```

## Pages

### Main
- `/` — Landing (hero + pillars + philosophy)
- `/participate` — Events directory
- `/equip` — Gear recommendations
- `/runstate` — Runstate (Measure pillar)

### Legal/Info (ME/CE structure)
- `/about` — Identity, philosophy, pillars
- `/credits` — Attribution (unDraw, Sora, frameworks)
- `/privacy` — Data handling, third-party services
- `/terms` — Usage agreement, responsibilities
- `/disclaimer` — Health boundaries, not medical advice

## Video Compositions

| ID | Format | Duration | Use |
|----|--------|----------|-----|
| Post | 1080×1080 | 5s | Instagram feed |
| Reel | 1080×1920 | 10s | Reels/Stories |
| EventPost | 1080×1080 | 5s | Event promo |
| EventReel | 1080×1920 | 8s | Event promo |

Rendered videos output to: `apps/video/out/`

## Current Status (January 2025)

### Complete
- Landing page with unified hero + pillars
- Random illustration rotation (unDraw SVGs)
- Footer with site-wide navigation
- Legal pages (about, credits, privacy, terms, disclaimer)
- Remotion video setup
- 3 pillar posts rendered

### Not Started
- Database connection (Neon/Supabase)
- Authentication (Auth.js)
- Strava integration
- Events calendar
- Store/Equip functionality

## Session Notes

### 2025-01-25
- Added unDraw illustrations with random rotation
- Created ME/CE legal pages structure
- Built site-wide footer
- Merged hero + pillars (removed duplicate CTAs)
- Set up Remotion for social media videos
- Rendered participate.mp4, equip.mp4, measure.mp4
