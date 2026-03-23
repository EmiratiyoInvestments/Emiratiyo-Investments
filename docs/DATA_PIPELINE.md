# Data Pipeline

`transaction-26.csv` is the **single source of truth** for all live market intelligence on this platform.

---

## Source

| Detail | Value |
|---|---|
| Provider | Dubai Land Department |
| Download URL | https://dubailand.gov.ae/en/open-data/real-estate-data/#/ |
| File location | `public/transaction-26.csv` |
| Update frequency | Every few months (when DLD publishes new data) |

---

## How to Update

1. Download the latest CSV export from the Dubai Land Department portal
2. Rename it to `transaction-26.csv`
3. Replace the existing file at `public/transaction-26.csv`
4. No code changes required — everything re-derives automatically on next load

---

## File Format

The CSV contains individual property transaction records for Dubai. Key columns used:

| Column | Used For |
|---|---|
| Area name | Area grouping, heatmap, Emira context |
| Transaction price | Average price calculation, price trend |
| Price per sqft | Market rate benchmarking |
| Property type | Off-plan vs ready segmentation |
| Transaction date | Volume trends over time |

---

## Data Flow

```
public/transaction-26.csv
        │
        ▼
src/hooks/useCsvData.js
  ├── Parses CSV via PapaParse (client-side, streaming)
  ├── Normalises area names via lib/utils/areaMapping.js
  └── Derives stats object:
        ├── rows[]              raw transaction records
        ├── stats.topAreasByCount[]   ranked areas by transaction volume
        ├── stats.topAreasByPrice[]   ranked areas by avg price
        ├── stats.areaMap{}     per-area aggregated stats
        ├── stats.totalTx       total transaction count
        └── stats.uniqueAreas[] list of all unique areas
              │
              ├──► TransactionInsights.jsx     volume/price charts
              ├──► DubaiHeatMap.jsx            choropleth map
              │       └── lib/utils/transactionDataUtils.js
              │               deriveAreaDataFromRows()
              │               buildGeoFeatureLookup()
              ├──► CompareAreas.jsx            side-by-side area comparison
              ├──► AutoInsights.jsx            auto-generated market commentary
              └──► EmiraControls / emiraFormatters.js
                      buildMarketContext(stats, selectedArea)
                              │
                              ▼
                      Injected into Emira AI prompt
                      POST /api/internal/analyse
                              │
                              ▼
                      AI analysis streamed back → saved to DB
                      Retrievable via GET /api/internal/history/:id
```

---

## Weekly Market Report (Separate)

The weekly snapshot is **not** derived from the CSV. It is manually entered and stored in Sanity.

### Option A — Script (recommended)

```bash
# 1. Edit scripts/push-weekly-report.mjs — update the DATA object with new figures
# 2. Run:
node scripts/push-weekly-report.mjs
```

Data source: https://dxbinteract.com/weekly-property-summary

### Option B — Sanity Dashboard

1. Open [Sanity Studio](https://sanity.io/manage)
2. Navigate to `Market Report` document type
3. Create or update the entry for the current week
4. Publish

### What It Powers

`WeeklySnapshot.jsx` — reads the latest `marketReport` document via GROQ and renders:
- Total value, volume, price/sqft with % change
- Top 5 projects across 5 categories (off-plan apts, off-plan villas, ready apts, ready villas, plots)
