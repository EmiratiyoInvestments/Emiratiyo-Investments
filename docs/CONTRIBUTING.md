# Contributing

---

## Local Setup

```bash
git clone <repo-url>
cd emiratiyo-investments
npm install
cp .env.example .env    # fill in values — see docs/ENV_SETUP.md
npm run dev
```

Place `transaction-26.csv` in `/public` before running. See [DATA_PIPELINE.md](DATA_PIPELINE.md).

---

## Branching

| Branch | Purpose |
|---|---|
| `main` | Production — auto-deploys to Vercel |
| `dev` | Integration branch for work-in-progress |
| `feature/your-feature` | Individual feature branches |

**Flow:** `feature/*` → PR into `dev` → reviewed → merged into `main`

---

## Pull Requests

- PRs must target `dev`, not `main`
- Title format: `feat:`, `fix:`, `chore:`, `docs:`
- Include a short description of what changed and why
- No PR without a passing build (`npm run build`)

---

## Linting

```bash
npm run lint        # ESLint check
```

Rules defined in `eslint.config.js`. No console.log in production code.

---

## Updating Transaction Data

1. Download latest CSV from https://dubailand.gov.ae/en/open-data/real-estate-data/#/
2. Rename to `transaction-26.csv`
3. Replace `public/transaction-26.csv`
4. Run `npm run build` to verify no errors
5. Commit and push

> No code changes needed — all components re-derive from the CSV automatically.

---

## Updating the Weekly Market Report

### Option A — Script (preferred)
```bash
# 1. Open scripts/push-weekly-report.mjs
# 2. Update the DATA object with figures from:
#    https://dxbinteract.com/weekly-property-summary
# 3. Run:
node scripts/push-weekly-report.mjs
```

### Option B — Sanity Dashboard
1. Open Sanity Studio → Market Report
2. Create new entry for the current week
3. Publish

---

## Code Style

- **Components:** PascalCase filenames, one component per file
- **Hooks:** `use` prefix, camelCase
- **Utilities:** camelCase, pure functions only — no React imports
- **Feature modules:** self-contained in `src/features/<name>/`
- **Inline styles** over external CSS classes for component-specific styles
- **No grey chart colors** — use `#1e293b`, `#fde8e4`, or semantic colors only
