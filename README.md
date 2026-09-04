<div align="center">

# Groww Pulse

### Know what changed. Know what matters.

*Your market, filtered to what matters.*

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

</div>

---

## Problem

A traditional watchlist answers: *"What is the price of my stocks?"*

But investors don't need more data — they need less noise. When you return after hours or days, you're forced to mentally scan every stock, remember old prices, and figure out what actually matters. This doesn't scale.

## Solution

**Groww Pulse** is an intelligent market watchlist that answers a better question:

> *"What changed since I last checked, why does it matter, and what deserves my attention?"*

Instead of showing raw market data, Groww Pulse:

1. **Remembers** what you saw last — price, volume, and timestamp per stock
2. **Detects** meaningful changes — not just price movement, but statistical anomalies, volume spikes, 52-week events
3. **Scores** each change with an explainable Attention Score (0–100)
4. **Personalizes** relevance based on your goals and preferences
5. **Reduces** information overload by telling you what *doesn't* need your attention

## Key Features

- **"Since you last checked"** — Server-side last-seen state that works across sessions and devices
- **Meaningful Change Detection** — Statistical anomaly detection (z-scores), volume ratios, 52-week events
- **Explainable Attention Scoring** — Weighted 0–100 score with full breakdown of why each stock matters
- **Goal-Linked Relevance** — Associate stocks with financial goals; changes to goal-linked stocks rank higher
- **Market Data Reliability** — Freshness indicators (Fresh/Delayed/Stale/Unavailable), fallback providers, partial failure handling
- **Background Processing** — BullMQ workers for market refresh, change detection, and alert processing
- **Watchlist Management** — Create, rename, delete watchlists; add/remove stocks with search
- **Custom Alerts** — Price thresholds, movement percentages, attention score triggers
- **User Preferences** — Control which signal types matter to you
- **Demo Mode** — Deterministic demo data for reliable presentations

## Product Philosophy

> **Don't show users more market information. Reduce the amount of information they need to process.**

The central flow:

```
Market Data → What Changed? → Is It Meaningful? → Why Does It Matter?
→ Does It Matter To This User? → What Deserves Attention?
```

## Architecture

Clean modular monolith — clear domain boundaries without microservice complexity.

```
┌──────────────┐
│   Frontend   │  React + Vite + TypeScript + Tailwind + shadcn/ui
└──────┬───────┘
       │
┌──────▼───────┐
│  Express API │  REST API with Zod validation
└──────┬───────┘
       │
┌──────▼───────┐  ┌───────────┐  ┌──────────────┐
│  PostgreSQL  │  │   Redis   │  │   BullMQ     │
│  (12 models) │  │  (cache)  │  │  (workers)   │
└──────────────┘  └───────────┘  └──────┬───────┘
                                        │
                                 ┌──────▼───────┐
                                 │Market Provider│
                                 │  (abstract)   │
                                 └──────┬───────┘
                                        │
                                 ┌──────▼───────┐
                                 │Change Engine  │
                                 │+ Attention    │
                                 │  Scoring      │
                                 └──────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, React Router, Recharts, Lucide React |
| Backend | Node.js, TypeScript, Express, Prisma, Zod |
| Database | PostgreSQL |
| Cache & Queues | Redis, BullMQ |
| Testing | Vitest, Supertest, Playwright |
| Infrastructure | Docker, Docker Compose, Nginx |
| CI/CD | GitHub Actions |

## Local Development

### Prerequisites

- Node.js ≥ 18
- Docker & Docker Compose
- Git

### Quick Start

```bash
# Clone
git clone <repo-url>
cd groww-pulse

# Environment
cp .env.example .env

# Start everything with Docker
docker compose up --build

# Or run locally (requires PostgreSQL and Redis running)
npm install
npm run db:migrate
npm run dev
```

### Docker

```bash
# Start all services
docker compose up --build

# Services:
#   web      → http://localhost:5173
#   api      → http://localhost:3001
#   postgres → localhost:5432
#   redis    → localhost:6379
```

## Database

12 models with full referential integrity:

`User` · `Stock` · `Watchlist` · `WatchlistStock` · `MarketSnapshot` · `UserStockState` · `DetectedChange` · `UserEvent` · `Goal` · `GoalStock` · `UserPreference` · `Alert`

## API

RESTful API with JWT authentication, Zod validation, rate limiting, and structured error responses.

| Module | Endpoints |
|--------|----------|
| Auth | `POST /api/auth/register`, `/login`, `/logout`, `GET /me` |
| Watchlists | `GET/POST/PATCH/DELETE /api/watchlists`, stock management |
| Stocks | `GET /api/stocks/search`, `/:symbol`, `/:symbol/history` |
| Dashboard | `GET /api/dashboard`, `/attention`, `/summary` |
| Changes | `GET /api/changes`, `POST /:stockId/seen` |
| Goals | `GET/POST/PATCH/DELETE /api/goals`, stock linking |
| Preferences | `GET/PATCH /api/preferences` |
| Alerts | `GET/POST/PATCH/DELETE /api/alerts` |
| Health | `GET /health`, `GET /ready` |

## Engineering Decisions

| Decision | Rationale |
|----------|-----------|
| Modular monolith | Clear domains without distributed-system complexity at hackathon scale |
| Statistical detection | Transparent, explainable anomaly detection without ML training data |
| Server-side last-seen | Cross-device persistence and accurate user-specific comparisons |
| Provider abstraction | No vendor lock-in; fallback chain improves resilience |
| Centralized market data | One fetch serves all users — API calls don't multiply with user count |

## Trade-offs

- **No ML/AI dependency** — Deterministic detection is explainable and works without external APIs
- **No microservices** — Operational simplicity over theoretical scalability at current scale
- **No real-time WebSockets** — Polling with smart caching is simpler and sufficient for the use case
- **Demo mode over live-only** — Presentation reliability is critical for a hackathon

## Testing

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Type check
npm run typecheck

# Lint
npm run lint
```

## Future Improvements

- WebSocket real-time updates
- Push notifications for alerts
- Portfolio tracking integration
- Mobile app (React Native)
- ML-based anomaly detection with user feedback loop
- Social watchlists and shared attention feeds

---

<div align="center">

**Groww Pulse** — *Built for the Groww Hackathon*

*This is an independent project and is not affiliated with or endorsed by Groww.*

</div>
