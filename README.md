# Emiratiyo Investments

Dubai real estate intelligence platform — live transaction data, AI market analysis, weekly reports, and property listings.


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
    │   ├── useEmiraMutations.js     # Emira AI streaming analysis hook
    │   ├── useEmContactMutations.js # Contact form submission hook
    │   └── useEmBusinessSetupMutations.js
    │
    ├── lib/
    │   └── sanity/
    │       ├── blogQueries.js       # GROQ queries for blog content
    │       └── propertyQueries.js   # GROQ queries for property listings
    │
    ├── features/
    │   ├── market-intelligence/     # DLD pipeline: ingest → clean → normalize → aggregate → map
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
    │   │   ├── pricing/             # WeeklySnapshot, AutoInsights
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


## Backend Architecture

Monolith layered architecture deployed on Fly.io.  
→ See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## Further Reading

- [docs/ENV_SETUP.md](docs/ENV_SETUP.md) — All environment variables
- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) — How to contribute


© 2026 Emiratiyo. All Rights Reserved. See [LICENSE](./LICENSE).