# Country Explorer

Web application for exploring countries with live profiles, maps, statistics, comparisons, rankings, world time, and an AI assistant.

## Overview

| Item | Description |
|------|-------------|
| Purpose | Browse and compare country data in one interface |
| Countries | 250+ nations with profiles, flags, and filters |
| Theme | Light and dark mode across all pages |
| Assistant | OpenRouter LLM intent parsing with verified data responses |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS v4, CSS variables |
| Components | Radix UI, shadcn-style primitives |
| Data fetching | TanStack Query |
| Charts | Recharts |
| Maps | React Simple Maps, d3-geo, TopoJSON |
| Motion | Framer Motion |
| Theme | next-themes |
| Notifications | Sonner |

## Data Sources

| Source | Used for |
|--------|----------|
| mledoze/countries | Names, capitals, regions, languages, currencies, borders |
| World Bank Open Data | Population, GDP, life expectancy trends |
| dr5hn countries database | Timezones, phone codes, culture enrichment |
| FlagCDN | Country flag images |
| world-atlas (TopoJSON) | Interactive map geography |
| OpenRouter (optional) | Assistant question understanding |

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/countries` | GET | All country summaries |
| `/api/countries/[code]` | GET | Single country profile |
| `/api/assistant` | POST | Assistant query processing |

## Application Pages

| Route | Feature |
|-------|---------|
| `/` | Home, featured countries, regions, rankings preview |
| `/countries` | Searchable country list with filters |
| `/countries/[code]` | Country detail with charts and map |
| `/compare` | Side-by-side country comparison |
| `/map` | Interactive world map |
| `/statistics` | Charts and regional breakdowns |
| `/rankings` | Population, area, HDI, happiness, languages |
| `/time` | Live world time and time zones by country |
| `/assistant` | AI country assistant |
| `/quiz` | Geography quiz |
| `/flags` | Flag explorer |
| `/currency` | Currency explorer |
| `/favorites` | Saved countries |
| `/about` | About the platform |

## Project Structure

```
src/
├── app/                    Routes, layouts, API handlers
│   ├── api/                Server endpoints
│   └── [pages]/            Feature pages
├── components/
│   ├── brand/              Logo and branding
│   ├── features/           Feature UI modules
│   ├── layout/             Header, footer
│   └── ui/                 Reusable UI primitives
├── lib/
│   ├── api/                Data loaders and business logic
│   ├── hooks/              React Query and client hooks
│   ├── constants.ts        Static reference data
│   ├── format.ts           Formatting helpers
│   └── utils.ts            Shared utilities
└── types/                  TypeScript definitions
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes | Enables LLM intent parsing for the assistant |
| `OPENROUTER_MODEL` | Yes | Model slug (default: `openai/gpt-4o-mini`) |

.env.local` and add your keys.

## Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000



## License

Private project. All rights reserved.
