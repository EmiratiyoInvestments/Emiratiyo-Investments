# Emiratiyo Investments

Dubai real estate intelligence platform — live transaction data, AI market analysis, weekly reports, and property listings.

---

## Key URLs

| Resource | URL |
|---|---|
| Production site | https://emiratiyo.com |
| Backend API | https://thecheatschool-api.fly.dev |
| Backend repo | https://github.com/EmiratiyoInvestments/emiratiyo-investments-api |
| Weekly market data source | https://dxbinteract.com/weekly-property-summary |
| Transaction data source | https://dubailand.gov.ae/en/open-data/real-estate-data/#/ |
| Blog automation (Make.com) | https://eu1.make.com/1051309/scenarios/4497598/edit |
| Sanity Studio | https://sanity.io/manage |

---

## Project Structure

```
emiratiyo-investments/
├── scripts/
│   └── push-weekly-report.mjs      # Pushes weekly market data to Sanity
├── public/                          # Static assets served at root
├── index.html
├── vite.config.js
├── vercel.json                      # Vercel routing config
└── src/
    ├── App.jsx                      # Router + layout wrapper
    ├── main.jsx                     # React entry point + Toaster mount
    ├── index.css                    # Global styles
    │
    ├── config/
    │   ├── sanityClient.js          # Sanity client + urlFor image builder
    │   └── api.js                   # Axios/fetch base client for backend
    │
    ├── store/
    │   └── emiraStore.js            # Zustand store for Emira AI agent state
    │
    ├── hooks/
    │   ├── useCsvData.js            # Parses transaction-26.csv → stats/rows
    │   ├── useEmiraMutations.js     # Emira AI streaming analysis hook
    │   ├── useEmContactMutations.js # Contact form submission hook
    │   └── useEmBusinessSetupMutations.js
    │
    ├── lib/
    │   ├── sanity/
    │   │   ├── blogQueries.js       # GROQ queries for blog content
    │   │   └── propertyQueries.js   # GROQ queries for property listings
    │   └── utils/
    │       ├── areaMapping.js       # Dubai area name normalization
    │       ├── geocoding.js         # Area → lat/lng for map rendering
    │       └── transactionDataUtils.js  # Derives stats from CSV rows
    │
    ├── features/
    │   └── emira/                   # Emira AI agent feature module
    │       ├── EmiraAuth.jsx        # PIN login overlay + 72h session
    │       ├── EmiraControls.jsx    # Area selector + analysis buttons
    │       ├── EmiraHistory.jsx     # History sidebar with delete flow
    │       ├── EmiraResultCard.jsx  # Charts, stat cards, formatted output
    │       └── emiraFormatters.js   # Constants, extractors, market context
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Header.jsx
    │   │   └── Footer.jsx
    │   ├── ui/
    │   │   └── ROICalculator.jsx    # Floating ROI calculator widget
    │   ├── landing/                 # Hero, Features, FAQ, Testimonials, etc.
    │   ├── market-insights/
    │   │   ├── maps/                # Dubai heatmap, property map, global map
    │   │   ├── pricing/             # WeeklySnapshot, CompareAreas, AutoInsights
    │   │   └── transaction/         # TransactionInsights component
    │   └── contact/
    │
    └── pages/
        ├── LandingPage.jsx
        ├── AboutPage.jsx
        ├── ServicesPage.jsx
        ├── ContactPage.jsx
        ├── BusinessSetupPage.jsx
        ├── PropertiesPage.jsx
        ├── PropertyDetailsPage.jsx
        ├── MarketInsightsPage.jsx
        ├── BlogsPage.jsx
        ├── BlogsDetailsPage.jsx
        └── EmiraPage.jsx            # Emira AI agent orchestrator
```

---

## Data Flow

`transaction-26.csv` is the **single source of truth** for all live market data. Every chart, stat, heatmap, and AI analysis derives from this one file.

```
Dubai Land Department
        │
        ▼
transaction-26.csv  (placed in /public)
        │
        ├── useCsvData.js          parses CSV → rows[], stats{}
        │       │
        │       ├── TransactionInsights.jsx    transaction volume charts
        │       ├── DubaiHeatMap.jsx           area-level price heatmap
        │       ├── CompareAreas.jsx           area price comparison
        │       ├── AutoInsights.jsx           auto-generated insights
        │       └── EmiraControls / EmiraResultCard
        │               │
        │               └── emiraFormatters.js → buildMarketContext()
        │                       │
        │                       ▼
        │               POST /api/internal/analyse  (backend)
        │                       │
        │                       ▼
        │               Emira AI response (streamed SSE)
        │                       │
        │                       ▼
        │               Saved to backend DB → history endpoint
        │
        └── Weekly Market Report (separate Sanity dataset)
                ├── Option A: node scripts/push-weekly-report.mjs
                └── Option B: Sanity Studio dashboard
                        │
                        ▼
                WeeklySnapshot.jsx  (reads from Sanity via GROQ)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 7 |
| Routing | React Router v7 |
| State | Zustand |
| Server state | TanStack Query v5 |
| Animations | Framer Motion |
| Charts | Recharts |
| CMS | Sanity v3 |
| Styling | Vanilla CSS + inline styles |
| Icons | Lucide React |
| Toasts | Sonner v2 |
| CSV parsing | PapaParse |
| Backend | Node.js monolith on Fly.io |
| Deployment | Vercel |

---

## Quick Start

```bash
# 1. Clone and install
git clone <repo-url>
cd emiratiyo-investments
npm install

# 2. Set up environment variables
cp .env.example .env
# Fill in values — see docs/ENV_SETUP.md

# 3. Place the transaction CSV
# Download from Dubai Land Department and place at:
# public/transaction-26.csv

# 4. Run dev server
npm run dev

# 5. Build for production
npm run build
```

---

## Data Sources

| Source | Update Frequency | How to Update |
|---|---|---|
| `transaction-26.csv` | Every few months | Download from [Dubai Land Dept](https://dubailand.gov.ae/en/open-data/real-estate-data/#/) and replace file in `/public` |
| Weekly market report | Weekly | Run `node scripts/push-weekly-report.mjs` or update via Sanity dashboard |

---

## Automation

Blog content is auto-generated and published via a Make.com scenario.  
→ See [docs/AUTOMATION.md](docs/AUTOMATION.md)

---

## Backend Architecture

Monolith layered architecture deployed on Fly.io.  
→ See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## Further Reading

- [docs/DATA_PIPELINE.md](docs/DATA_PIPELINE.md) — CSV lifecycle and data flow
- [docs/ENV_SETUP.md](docs/ENV_SETUP.md) — All environment variables
- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) — How to contribute


© 2026 Emiratiyo. All Rights Reserved. See [LICENSE](./LICENSE).