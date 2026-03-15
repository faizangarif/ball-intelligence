# BALL INTELLIGENCE — Gain Ball Knowledge

A premium sports intelligence portal built by **Ayaan Arif**. Track NBA and NFL teams, explore live game experiences, analyze shot charts, read AI-powered game recaps, and get smarter about sports.

## Features

- **Homepage** — Dynamic hero, live game strip, trending players, AI recaps, smart facts
- **NBA Hub** — Standings, stat leaders, Celtics spotlight, player pages
- **NFL Hub** — Division standings, stat leaders, Eagles spotlight
- **Live Game Center** — Real-time scores, play-by-play timeline, AI Scorecast commentary, momentum visualization
- **Shot IQ** — Interactive NBA shot chart explorer with hot/cold zones, player comparison
- **Player Pages** — Stats, game logs, AI analysis, trend indicators
- **Stats Central** — League leaders across all major categories
- **Blog** — Original sports analysis and commentary
- **Search & Discover** — Find teams, players, and articles instantly
- **Favorites** — Save teams, players, and games (guest-friendly with localStorage)

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom dark theme
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Charts:** Recharts + custom SVG
- **State:** Zustand (favorites), React Query (data fetching)
- **Database:** PostgreSQL + Prisma ORM (optional — works fully with mock data)
- **Auth:** NextAuth (optional)
- **Deployment:** Vercel-ready

## Quick Start

```bash
# Clone the repository
cd ball-intelligence

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app works immediately with built-in mock data. No database setup required for demo mode.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── nba/               # NBA Hub
│   ├── nfl/               # NFL Hub
│   ├── teams/             # Team pages (Celtics, Eagles, generic)
│   ├── players/           # Player profile pages
│   ├── live/              # Live Game Center
│   ├── shot-iq/           # Shot IQ analytics
│   ├── stats/             # Stats explorer
│   ├── blog/              # Blog section
│   ├── discover/          # Search & discover
│   ├── favorites/         # Saved favorites
│   ├── about/             # About page
│   └── api/               # API route handlers
├── components/
│   ├── ui/                # Design system components
│   ├── layout/            # Header, footer, nav
│   ├── home/              # Homepage sections
│   ├── live/              # Live Game Center components
│   ├── shots/             # Shot IQ components
│   ├── players/           # Player page components
│   ├── teams/             # Team page components
│   ├── stats/             # Stats components
│   ├── blog/              # Blog components
│   ├── search/            # Search components
│   ├── favorites/         # Favorites components
│   ├── nba/               # NBA-specific components
│   ├── nfl/               # NFL-specific components
│   └── shared/            # Shared components
├── lib/
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── services/          # Business logic services
│   ├── data/mock/         # Mock data (teams, players, games, articles, shots)
│   └── hooks/             # Custom React hooks
└── prisma/                # Database schema
```

## Data Architecture

Ball Intelligence uses a clean layered architecture:

1. **Mock Data Layer** (`lib/data/mock/`) — Comprehensive seeded data for all teams, players, games, articles, and shot charts
2. **Services Layer** (`lib/services/`) — Business logic that reads from the data layer
3. **API Routes** (`app/api/`) — REST endpoints for client-side data fetching
4. **Server Components** — Pages fetch data directly from services for SSR

### Switching from Mock to Live Data

The app is designed to swap data sources via environment variable:

```env
# Use built-in mock data (default)
SPORTS_DATA_PROVIDER=mock

# Use a live sports API (requires adapter implementation)
SPORTS_DATA_PROVIDER=api
```

To connect a live sports API:
1. Create an adapter in `lib/data/adapters/` implementing the same interface as the mock provider
2. Wire it up in the services layer
3. Recommended APIs: [ESPN API](https://site.api.espn.com), [SportsData.io](https://sportsdata.io), [The Sports DB](https://www.thesportsdb.com)

## AI Scorecast

The AI Scorecast system generates engaging sports commentary from game events:

- **Template Engine** — Pattern-based commentary using event data ("Tatum drains a deep three — Celtics lead by 6")
- **Momentum Analysis** — Tracks scoring runs and momentum shifts
- **Game Summaries** — Generates narrative recaps from box score and events
- **OpenAI Integration** (optional) — Set `OPENAI_API_KEY` to enable AI-generated commentary. Falls back to templates if not configured.

## Database Setup (Optional)

The app works fully without a database. To enable persistent data:

```bash
# Start PostgreSQL (via Docker or local install)
# Update DATABASE_URL in .env

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database
npm run db:seed
```

## Running Tests

```bash
# Unit tests
npm test

# E2E tests
npx playwright install
npm run test:e2e
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy

The app works on Vercel's free tier with mock data. For database features, add a PostgreSQL provider (Vercel Postgres, Supabase, Neon, etc).

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Design System

Ball Intelligence uses a premium dark theme:

| Token | Value | Usage |
|-------|-------|-------|
| `background` | `#0a0a0f` | Page background |
| `surface` | `#111118` | Cards, panels |
| `surfaceLight` | `#1a1a24` | Elevated surfaces |
| `border` | `#2a2a3a` | Borders, dividers |
| `text` | `#e5e5e5` | Primary text |
| `textMuted` | `#8a8a9a` | Secondary text |
| `accent` | `#00a651` | Celtics green, primary accent |
| `live` | `#ef4444` | Live indicators |

## Favorite Teams

- **Boston Celtics** (NBA) — Featured with custom green accent
- **Philadelphia Eagles** (NFL) — Featured with custom teal accent

---

Built with elite taste by **Ayaan Arif** | Powered by Next.js
