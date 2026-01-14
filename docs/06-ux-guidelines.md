# 1HP — UX & Design Guidelines

## Design Philosophy

Think like:
- **Apple Health** — Meaning over noise
- **Stripe** — Clarity and hierarchy
- **Arc / Notion** — Modern calm
- **Garmin internals** — Serious, physiological

No startup hype. No gamification. No engagement hacks.

---

## Core Principles

### 1. One Idea Per Screen

Each screen should communicate a single concept. If you need to explain multiple things, use multiple screens.

### 2. No Dopamine Loops

- No streaks
- No badges
- No achievements
- No "you're on fire" messages
- No notifications designed to bring users back

### 3. Calm Over Clever

- Restrained animations
- No surprise interactions
- Predictable navigation
- Quiet transitions

### 4. Typography Over Decoration

- Let type do the work
- Minimal use of icons
- No decorative elements
- White space is content

### 5. No Charts as Heroes

Charts support understanding. They are not centerpieces.

- Charts appear when needed
- They explain, not impress
- Simple line/bar charts only
- No 3D, no gradients, no animations

---

## Visual Language

### Typography

- Primary: Inter (system fallback: sans-serif)
- Weights: Light (300), Regular (400), Medium (500)
- Sizes follow Tailwind scale

### Colors

Semantic tokens only:

```css
--background: white/black
--foreground: black/white
--muted: grey
--muted-foreground: grey text
--border: subtle grey
```

No brand colors. No accent colors for engagement.

### Spacing

Generous. Let content breathe.

---

## Component Guidelines

### Cards

- Subtle border
- No shadows (or very subtle)
- Clear hierarchy: title, description
- Hover state: slightly darker border

### Buttons

- Primary: solid background
- Secondary: outlined
- No gradients
- No animations on hover (color change only)

### Forms

- Clear labels
- Helpful (not clever) placeholders
- Error states are informative, not alarming

### Navigation

- Minimal items
- Current state clearly indicated
- No mega-menus
- No hamburger menus on desktop

---

## Forbidden Patterns

| Pattern | Why |
|---------|-----|
| Confetti/celebrations | Gamification |
| Progress rings with percentages | Implies goals |
| Red/green for good/bad | Value judgment |
| Comparison to others | Ranking |
| "Keep it up!" messaging | Motivation hacking |
| Daily/weekly targets | Pressure |
| Notifications for engagement | Manipulation |
| Social sharing prompts | Network effects |

---

## Allowed Patterns

| Pattern | When |
|---------|------|
| Simple progress indicators | For multi-step flows |
| Confirmation messages | After user actions |
| Helpful empty states | When no data exists |
| Clear error messages | When something fails |
| Informative tooltips | For complex concepts |

---

## Writing for UI

### Headlines

- Short
- Factual
- No exclamation marks

### Body Text

- Second person when addressing user ("Your current state")
- Present tense
- No marketing speak

### Empty States

- Explain what will appear
- How to make it appear
- No guilt about absence

**Good**: "Runstate needs activity data to understand your current state. Connect a data source to begin."

**Bad**: "No activities yet! Start moving to see your stats!"

### Error States

- What happened
- What user can do
- No blame

**Good**: "Could not connect to Strava. Check your internet connection and try again."

**Bad**: "Oops! Something went wrong."

---

## Accessibility

- Sufficient color contrast
- Keyboard navigable
- Screen reader friendly
- No reliance on color alone for meaning
- Focus states visible

---

## Responsive Behavior

- Mobile-first design
- Three breakpoints: mobile, tablet, desktop
- Content reflows, doesn't hide
- Touch targets minimum 44px

---

## The Test

Before shipping any UI:

> "Can this be explained to a serious athlete without apology?"

If you feel the need to justify or apologize for any design decision, reconsider it.
