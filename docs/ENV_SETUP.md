# Environment Variables

All variables are prefixed with `VITE_` — accessible in the browser via `import.meta.env.*`.

---

## Local Setup

```bash
cp .env.example .env
```

Create `.env` in the project root with the values below. Never commit `.env` to git — it is already in `.gitignore`.

---

## Variables

### Sanity (CMS)

| Variable | Description | Required | Secret |
|---|---|---|---|
| `VITE_SANITY_PROJECT_ID` | Sanity project ID | ✅ | ❌ |
| `VITE_SANITY_DATASET` | Sanity dataset name (`production`) | ✅ | ❌ |
| `VITE_SANITY_TOKEN` | Sanity API token (needs read + write) | ✅ | ✅ |

### Backend

| Variable | Description | Required | Secret |
|---|---|---|---|
| `VITE_BACKEND_API` | Backend base URL | ✅ | ❌ |
| `VITE_EMIRA_SECRET` | Internal API key for Emira routes | ✅ | ✅ |

---

## Example `.env`

```env
# Sanity
VITE_SANITY_PROJECT_ID=kgljxpj0
VITE_SANITY_DATASET=production
VITE_SANITY_TOKEN=sk...your-token-here

# Backend
VITE_BACKEND_API=https://thecheatschool-api.fly.dev
VITE_EMIRA_SECRET=your-secret-here
```

---

## Example `.env.example` (safe to commit)

```env
# Sanity
VITE_SANITY_PROJECT_ID=
VITE_SANITY_DATASET=production
VITE_SANITY_TOKEN=

# Backend
VITE_BACKEND_API=https://thecheatschool-api.fly.dev
VITE_EMIRA_SECRET=
```

---

## Vercel Deployment

Add all variables in **Vercel → Project → Settings → Environment Variables**.

`VITE_SANITY_TOKEN` and `VITE_EMIRA_SECRET` must be marked as **Sensitive** in Vercel.

---

## Where Each Is Used

| Variable | Used In |
|---|---|
| `VITE_SANITY_PROJECT_ID` | `src/config/sanityClient.js` |
| `VITE_SANITY_DATASET` | `src/config/sanityClient.js` |
| `VITE_SANITY_TOKEN` | `src/config/sanityClient.js`, `scripts/push-weekly-report.mjs` |
| `VITE_BACKEND_API` | `src/hooks/useEmiraMutations.js`, `src/pages/EmiraPage.jsx`, `src/config/api.js` |
| `VITE_EMIRA_SECRET` | `src/pages/EmiraPage.jsx` (all `/api/internal/*` requests) |
