# 1HP Documentation

## One Human Powered

This documentation covers the philosophy, architecture, and development guidelines for 1HP.

---

## Contents

| Document | Description |
|----------|-------------|
| [00 — Overview](./00-overview.md) | What is 1HP, the three pillars, project status |
| [01 — Philosophy](./01-philosophy.md) | Core beliefs, language rules, boundaries |
| [02 — Tech Stack](./02-tech-stack.md) | Approved technologies, architecture principles |
| [03 — Runstate Engine](./03-runstate-engine.md) | Intelligence layer specification |
| [04 — Folder Structure](./04-folder-structure.md) | Repository layout, naming conventions |
| [05 — Development](./05-development.md) | Getting started, scripts, workflow |
| [06 — UX Guidelines](./06-ux-guidelines.md) | Design principles, visual language |

---

## Quick Reference

### The Three Pillars

| Pillar | Route | Purpose |
|--------|-------|---------|
| Participate | `/participate` | Find human-powered events |
| Equip | `/equip` | Gear that lasts |
| Understand | `/runstate` | Know where you are |

### Key Boundaries

1. **Pillars don't couple** — Events, Store, Runstate are independent
2. **Engine is isolated** — No UI, API, or analytics in computation
3. **Analytics are guardrailed** — Track interaction, not bodies

### Language Quick Guide

**Use**: state, load, trend, baseline, balance, continuity, movement

**Avoid**: grind, hustle, crush, PR, beast, streak, optimisation

### The Litmus Test

> "Can this be explained to a serious athlete without apology?"

---

## Development

```bash
npm install
npm run dev
# → http://localhost:3335
```

---

## Current Status

- Scaffolding: Complete
- Landing page: Complete
- Route structure: Complete
- Runstate engine: Implemented
- Database: Schema defined, not connected
- Authentication: Not started
- Strava integration: Not started
