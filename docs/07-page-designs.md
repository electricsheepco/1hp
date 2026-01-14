# 1HP — Page Designs

## Design System Reference

**Typography**: Inter, light/regular/medium weights
**Palette**: Monochrome with semantic tokens
**Spacing**: Generous, content breathes
**Interactions**: Subtle, no animations for engagement

---

## 1. Landing Page (`/`)

```
┌─────────────────────────────────────────────────────────────────┐
│  1HP                              Participate  Equip  Understand │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                                                                  │
│                              1HP                                 │
│                                                                  │
│                       One Human Powered                          │
│                                                                  │
│                      Movement, by humans.                        │
│                                                                  │
│                                                                  │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│   │                   │ │                   │ │                   │
│   │   Participate     │ │      Equip        │ │    Understand     │
│   │                   │ │                   │ │                   │
│   │   Find where      │ │   Gear that       │ │   Know where      │
│   │   humans move     │ │   lasts           │ │   you are         │
│   │   together        │ │                   │ │                   │
│   │                   │ │                   │ │                   │
│   │              →    │ │              →    │ │              →    │
│   └───────────────────┘ └───────────────────┘ └───────────────────┘
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Notes**:
- Hero is pure typography, centered
- Three cards below with subtle borders
- Arrow (→) indicates navigable, not a loud CTA
- No images, no backgrounds

---

## 2. Participate — Events Calendar (`/participate`)

```
┌─────────────────────────────────────────────────────────────────┐
│  1HP                              Participate  Equip  Understand │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Participate                                                    │
│   Find human-powered events                                      │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  ◀  January 2025                                    ▶   │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │  Mon    Tue    Wed    Thu    Fri    Sat    Sun          │   │
│   │                  1      2      3      4      5          │   │
│   │                              ●                          │   │
│   │   6      7      8      9     10     11     12           │   │
│   │          ●                          ●●                  │   │
│   │  13     14     15     16     17     18     19           │   │
│   │                 ●                    ●                  │   │
│   │  20     21     22     23     24     25     26           │   │
│   │   ●                                  ●                  │   │
│   │  27     28     29     30     31                         │   │
│   │                        ●                                │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   Filter:  [All]  [Run]  [Cycle]  [Swim]  [Tri]  [Walk]         │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   January 3                                                      │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  ◯ RUN                                                  │   │
│   │                                                         │   │
│   │  Mumbai Marathon 2025                                   │   │
│   │  Mumbai, Maharashtra                                    │   │
│   │                                                         │   │
│   │  Full · Half · 10K · 5K                           →     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   January 11                                                     │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  ◯ CYCLE                                                │   │
│   │                                                         │   │
│   │  Tour of Nilgiris                                       │   │
│   │  Ooty, Tamil Nadu                                       │   │
│   │                                                         │   │
│   │  200K · 100K                                      →     │   │
│   └─────────────────────────────────────────────────────────┘   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  ◯ TRI                                                  │   │
│   │                                                         │   │
│   │  Goa Triathlon                                          │   │
│   │  Panjim, Goa                                            │   │
│   │                                                         │   │
│   │  Olympic · Sprint                                 →     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Notes**:
- Calendar shows dots for event days
- Clicking a day scrolls to that day's events
- Filter chips are toggleable, muted when inactive
- Event cards show: type icon, name, location, distances
- No registration counts, no "filling fast" urgency
- Arrow indicates external link to event page

**Activity Icons** (Lucide):
- Run: `circle-dot` or custom running figure
- Cycle: `bike`
- Swim: `waves`
- Tri: `trophy` or combined icon
- Walk: `footprints`

---

## 3. Equip — Store (`/equip`)

```
┌─────────────────────────────────────────────────────────────────┐
│  1HP                              Participate  Equip  Understand │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Equip                                                          │
│   Gear that lasts                                                │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Filter:  [All]  [Apparel]  [Accessories]                      │
│                                                                  │
│   ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│   │                 │ │                 │ │                 │   │
│   │   [  image  ]   │ │   [  image  ]   │ │   [  image  ]   │   │
│   │                 │ │                 │ │                 │   │
│   │  1HP Tee        │ │  Movement Cap   │ │  Run Socks      │   │
│   │  Black          │ │  Stone          │ │  3-Pack         │   │
│   │                 │ │                 │ │                 │   │
│   │  ₹1,200         │ │  ₹800           │ │  ₹600           │   │
│   │                 │ │                 │ │                 │   │
│   └─────────────────┘ └─────────────────┘ └─────────────────┘   │
│                                                                  │
│   ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│   │                 │ │                 │ │                 │   │
│   │   [  image  ]   │ │   [  image  ]   │ │   [  image  ]   │   │
│   │                 │ │                 │ │                 │   │
│   │  Long Sleeve    │ │  Buff           │ │  Arm Sleeves    │   │
│   │  Navy           │ │  Charcoal       │ │  White          │   │
│   │                 │ │                 │ │                 │   │
│   │  ₹1,800         │ │  ₹500           │ │  ₹450           │   │
│   │                 │ │                 │ │                 │   │
│   └─────────────────┘ └─────────────────┘ └─────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Notes**:
- Clean grid layout
- Product images are simple, no lifestyle shots
- Name, variant, price — nothing more
- No "bestseller" badges, no reviews, no urgency
- Hover shows subtle border change

---

## 4. Product Detail (`/equip/[slug]`)

```
┌─────────────────────────────────────────────────────────────────┐
│  1HP                              Participate  Equip  Understand │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ← Back to Equip                                                │
│                                                                  │
│   ┌─────────────────────────────┐  ┌────────────────────────┐   │
│   │                             │  │                        │   │
│   │                             │  │  1HP Tee               │   │
│   │                             │  │                        │   │
│   │                             │  │  ₹1,200                │   │
│   │                             │  │                        │   │
│   │        [  product  ]        │  │  A simple tee for      │   │
│   │        [   image   ]        │  │  movement. Cotton      │   │
│   │                             │  │  blend, relaxed fit.   │   │
│   │                             │  │                        │   │
│   │                             │  │  Color                 │   │
│   │                             │  │  ● Black  ○ White      │   │
│   │                             │  │  ○ Stone               │   │
│   │                             │  │                        │   │
│   │                             │  │  Size                  │   │
│   │                             │  │  [S] [M] [L] [XL]      │   │
│   │                             │  │                        │   │
│   │                             │  │  ┌──────────────────┐  │   │
│   │                             │  │  │   Add to Bag     │  │   │
│   │                             │  │  └──────────────────┘  │   │
│   └─────────────────────────────┘  └────────────────────────┘   │
│                                                                  │
│   ──────────────────────────────────────────────────────────    │
│                                                                  │
│   Details                                                        │
│                                                                  │
│   • 60% cotton, 40% polyester                                   │
│   • Relaxed fit                                                  │
│   • Printed 1HP mark on chest                                   │
│   • Machine washable                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Notes**:
- Two-column layout: image left, details right
- Color swatches as circles
- Size as bordered boxes
- Single "Add to Bag" button, not loud
- Details section is plain list

---

## 5. Runstate — Current State (`/runstate`)

### 5a. Empty State (No Data)

```
┌─────────────────────────────────────────────────────────────────┐
│  1HP                              Participate  Equip  Understand │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Runstate                                                       │
│   Understanding your body                                        │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                                                                  │
│                                                                  │
│                    Runstate needs activity                       │
│                    data to understand your                       │
│                    current state.                                │
│                                                                  │
│                    Connect a data source                         │
│                    to begin.                                     │
│                                                                  │
│                    ┌────────────────────────┐                    │
│                    │   Connect Strava       │                    │
│                    └────────────────────────┘                    │
│                                                                  │
│                                                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5b. Insufficient Data

```
┌─────────────────────────────────────────────────────────────────┐
│  1HP                              Participate  Equip  Understand │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Runstate                                                       │
│   Understanding your body                                        │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Connected: Strava                              [Disconnect]    │
│                                                                  │
│   ──────────────────────────────────────────────────────────    │
│                                                                  │
│                                                                  │
│                    Runstate needs 2 more                         │
│                    activities to provide                         │
│                    meaningful insight.                           │
│                                                                  │
│                    1 of 3 minimum activities                     │
│                    recorded in the last 28 days.                 │
│                                                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5c. Active State (With Data)

```
┌─────────────────────────────────────────────────────────────────┐
│  1HP                              Participate  Equip  Understand │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Runstate                                                       │
│   Understanding your body                                        │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Connected: Strava                              [Disconnect]    │
│                                                                  │
│   ──────────────────────────────────────────────────────────    │
│                                                                  │
│   Your current state                                             │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                                                         │   │
│   │   LOAD                                                  │   │
│   │   42.3                                                  │   │
│   │   ──────────────●──────────────────────                 │   │
│   │   0            baseline                            100  │   │
│   │                 (38.5)                                  │   │
│   │                                                         │   │
│   │   Your current load is around your typical level.       │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   ┌──────────────────────────┐  ┌──────────────────────────┐   │
│   │                          │  │                          │   │
│   │   TREND                  │  │   BALANCE                │   │
│   │   Stable                 │  │   Balanced               │   │
│   │                          │  │                          │   │
│   │   Your load has been     │  │   Your recent activity   │   │
│   │   consistent over the    │  │   is balanced across     │   │
│   │   past two weeks.        │  │   types.                 │   │
│   │                          │  │                          │   │
│   └──────────────────────────┘  └──────────────────────────┘   │
│                                                                  │
│   ──────────────────────────────────────────────────────────    │
│                                                                  │
│   About this data                                   [Expand ▼]   │
│                                                                  │
│   Based on 12 activities over the past 28 days.                 │
│   Last updated: January 14, 2025 at 6:42 PM                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Notes**:
- Load shown with simple linear indicator, not a radial gauge
- Baseline marked on the scale for reference
- No color coding (red/green) — purely informational
- Trend and Balance as secondary cards
- Explanatory text below each metric
- "About this data" expandable for transparency
- No historical charts as hero — this is current state

---

## 6. Runstate — Expanded Explanation

```
┌─────────────────────────────────────────────────────────────────┐
│   About this data                                   [Collapse ▲] │
│                                                                  │
│   ──────────────────────────────────────────────────────────    │
│                                                                  │
│   What Runstate measures                                         │
│                                                                  │
│   Runstate combines your recent activities into a unified       │
│   view of your body's current state. It treats all human-       │
│   powered movement — running, cycling, swimming, walking —      │
│   as one continuous system.                                      │
│                                                                  │
│   Load                                                           │
│   A cumulative measure of recent physical stress. Recent        │
│   activities contribute more than older ones.                   │
│                                                                  │
│   Baseline                                                       │
│   Your personal reference point, calculated from the past       │
│   90 days of activity.                                          │
│                                                                  │
│   Trend                                                          │
│   Whether your load is rising, falling, or stable compared      │
│   to the previous two weeks.                                    │
│                                                                  │
│   Balance                                                        │
│   How your activity is distributed across different types.      │
│                                                                  │
│   ──────────────────────────────────────────────────────────    │
│                                                                  │
│   What Runstate does not do                                      │
│                                                                  │
│   Runstate does not tell you to do more or less. It does not   │
│   set goals or track streaks. It observes and explains.         │
│   What you do with this information is yours to decide.         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Authentication — Sign In

```
┌─────────────────────────────────────────────────────────────────┐
│  1HP                                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                                                                  │
│                                                                  │
│                         Sign in to 1HP                           │
│                                                                  │
│                                                                  │
│                    ┌────────────────────────┐                    │
│                    │  Email                 │                    │
│                    │  you@example.com       │                    │
│                    └────────────────────────┘                    │
│                                                                  │
│                    ┌────────────────────────┐                    │
│                    │   Continue with Email  │                    │
│                    └────────────────────────┘                    │
│                                                                  │
│                    ──────── or ────────                          │
│                                                                  │
│                    ┌────────────────────────┐                    │
│                    │   Continue with Strava │                    │
│                    └────────────────────────┘                    │
│                                                                  │
│                                                                  │
│                    By continuing, you agree to                   │
│                    our Terms and Privacy Policy.                 │
│                                                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Notes**:
- Email first (magic link)
- Strava as optional secondary method
- No social logins (Google, Facebook, etc.)
- Minimal copy, no "Get started free!" enthusiasm

---

## 8. Check Email (Magic Link Sent)

```
┌─────────────────────────────────────────────────────────────────┐
│  1HP                                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                                                                  │
│                                                                  │
│                         Check your email                         │
│                                                                  │
│                    We sent a sign-in link to                     │
│                    you@example.com                               │
│                                                                  │
│                    Click the link in the email                   │
│                    to continue.                                  │
│                                                                  │
│                                                                  │
│                    ┌────────────────────────┐                    │
│                    │   Resend email         │                    │
│                    └────────────────────────┘                    │
│                                                                  │
│                    ← Back to sign in                             │
│                                                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Navigation — Mobile

```
┌─────────────────────────────┐
│  1HP                    ☰   │
├─────────────────────────────┤
│                             │
│  (Content)                  │
│                             │
├─────────────────────────────┤
│                             │
│   Participate               │
│   Equip                     │
│   Understand                │
│                             │
│   ─────────────────────     │
│                             │
│   Sign in                   │
│                             │
└─────────────────────────────┘
```

**Notes**:
- Hamburger opens full-height drawer
- Simple list, no icons
- Divider before auth action

---

## Color & Component Reference

### Semantic Tokens

```css
--background: #ffffff (light) / #0a0a0a (dark)
--foreground: #0a0a0a (light) / #fafafa (dark)
--muted: #f5f5f5 (light) / #171717 (dark)
--muted-foreground: #737373
--border: #e5e5e5 (light) / #262626 (dark)
```

### Activity Type Colors (Icons Only)

| Type | Icon | Color (subtle) |
|------|------|----------------|
| Run | `circle-dot` | — |
| Cycle | `bike` | — |
| Swim | `waves` | — |
| Tri | `triangle` | — |
| Walk | `footprints` | — |

No background colors for types. Icons are muted-foreground. Differentiation through shape, not color.

### Button Variants

```
Primary:   bg-foreground text-background
Secondary: bg-transparent border-border text-foreground
Ghost:     bg-transparent text-muted-foreground
```

### Card Variant

```
bg-background
border border-border
rounded-lg
hover:border-foreground/20
```

---

## Responsive Breakpoints

| Name | Width | Layout |
|------|-------|--------|
| Mobile | < 640px | Single column |
| Tablet | 640-1024px | Two columns where appropriate |
| Desktop | > 1024px | Full layout |

---

## Animation Guidelines

**Allowed**:
- 150ms color transitions on hover
- 200ms opacity transitions for modals
- Subtle border transitions

**Not Allowed**:
- Loading spinners (use skeleton states)
- Celebratory animations
- Attention-grabbing motion
- Parallax effects
- Auto-playing anything
