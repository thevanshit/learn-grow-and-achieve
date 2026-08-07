# Learn-Grow-and-Achieve

A full-stack, personalized **GSoC 2027 planner** that turns a 40-week AI/ML roadmap into a daily habit tracker. Track books, weeks, milestones, custom tasks, streaks, and a live countdown to every GSoC deadline — from basics to advanced.

## Features

- **10 batches · 56 books · 40 weeks** — a curated O'Reilly reading list (see `Books .md`) mapped to a week-by-week GSoC roadmap (see `GSoC.md`).
- **Dashboard** — day streak, today's focus, overall progress rings, and a live GSoC 2027 countdown (org list → proposal → results → coding).
- **Planner** — expandable batch cards with per-week tasks (read + do) and one-click completion.
- **Books** — track every book as *to do / reading / done*, filter by batch and status, search.
- **Tasks** — daily custom tasks with priority, due dates, and completion that feeds your streak.
- **Milestones** — 8 portfolio milestones that prove your skills to GSoC orgs.
- **Timeline** — visual GSoC 2027 roadmap with "next up" highlighting.
- **Notes** — capture ideas and research.
- **Auth** — register/login with JWT, profile settings.

## Tech Stack

| Layer    | Tech |
|----------|------|
| Frontend | React 18, Vite 5, React Router 6 |
| Backend  | Node.js (Express) |
| Database | SQLite via built-in `node:sqlite` (local) or Turso/libSQL (deployed) |
| Auth     | JWT + bcrypt |

## Deploying to Vercel

The repo is pre-configured for Vercel (`vercel.json` + `api/index.js` serverless function).

> **Important:** Vercel serverless functions have a read-only filesystem, so the SQLite
> database must live in a hosted service. This project uses **Turso** (SQLite-compatible,
> free tier available).

### 1. Create a Turso database

```bash
# Install Turso CLI (or create via https://turso.tech dashboard)
curl -sSfL https://get.turso.tech/setup.sh | bash
turso auth login
turso db create learn-grow-achieve
turso db show learn-grow-achieve --url        # → libsql://...
turso db tokens create learn-grow-achieve     # → auth token
```

### 2. Seed the remote database

```bash
TURSO_DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." npm run seed
```

### 3. Deploy

```bash
vercel login
vercel env add TURSO_DATABASE_URL
vercel env add TURSO_AUTH_TOKEN
vercel --prod
```

Or connect the GitHub repo in the Vercel dashboard and add the two env vars there.

## Getting Started

### Prerequisites

- Node.js **v22.5+** (uses the built-in `node:sqlite` module; tested on Node 26)

### 1. Backend

```bash
cd server
npm install
npm run seed      # creates planner.db with 10 batches, 56 books, 40 weeks, 8 milestones
npm run dev       # or: npm start  → http://localhost:4000
```

### 2. Frontend (development)

```bash
cd client
npm install
npm run dev       # → http://localhost:5173 (proxies /api to :4000)
```

### 3. Production build

```bash
cd client && npm run build   # outputs client/dist
cd ../server && npm start    # serves the built client at http://localhost:4000
```

## Project Structure

```
Learn-grow-and-achieve/
├── server/
│   ├── index.js              # Express app, serves client/dist
│   ├── db.js                 # SQLite schema + migrations
│   ├── seed/                 # batches, books, weeks, milestones + seed script
│   ├── middleware/auth.js    # JWT auth
│   └── routes/               # auth, planner, tasks, stats
├── client/
│   ├── src/
│   │   ├── pages/            # Dashboard, Planner, Books, Tasks, Milestones, Timeline, Notes, Settings, Login
│   │   ├── components/       # Sidebar, Icons, shared UI
│   │   ├── styles/global.css # design system
│   │   └── api.js            # API client
│   └── vite.config.js        # dev proxy to :4000
└── README.md
```

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Get JWT |
| GET | `/api/auth/me` | Current user |
| PATCH | `/api/auth/me` | Update name/password |
| GET | `/api/batches` | Batches with per-user progress |
| GET | `/api/books` | Books with status |
| PATCH | `/api/books/:id` | Update status/progress |
| GET | `/api/weeks` | Weekly tasks with completion |
| PATCH | `/api/weeks/:id` | Toggle week completion |
| GET | `/api/milestones` | Portfolio milestones |
| PATCH | `/api/milestones/:id` | Toggle milestone |
| GET/POST | `/api/tasks` | Custom tasks (filter by `?date=`) |
| PATCH/DELETE | `/api/tasks/:id` | Update / delete task |
| GET | `/api/daily` | Daily completion log |
| GET/POST/DELETE | `/api/notes` | Notes |
| GET | `/api/stats` | Progress, streak, GSoC countdown |

All endpoints except `/api/auth/register` and `/api/auth/login` require `Authorization: Bearer <token>`.

## Roadmap Timing

- **Week 1 starts:** Mon 2026-08-03 (40 weeks)
- **GSoC Org List:** 2027-02-08
- **Proposal Deadline:** 2027-03-20
- **Results:** 2027-04-30
- **Coding Period:** 2027-05-17

## License

MIT