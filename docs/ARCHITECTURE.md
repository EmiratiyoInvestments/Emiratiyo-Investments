# Architecture

Backend API for Emiratiyo Investments.

- **API Base URL:** ``
- **Repository:** https://github.com/EmiratiyoInvestments/emiratiyo-investments-api
- **Infrastructure:** Fly.io (always-on, auto-wake ping from frontend on load)

---

## Design

Monolith layered architecture. No microservices. Clear separation between routing, business logic, and data access.

```
┌─────────────────────────────────┐
│           HTTP Clients          │  (Frontend, Make.com)
└────────────────┬────────────────┘
                 │
┌────────────────▼────────────────┐
│         Express Router          │  Route definitions + middleware
├─────────────────────────────────┤
│         Middleware Layer        │  Auth, rate-limiting, CORS, body parsing
├─────────────────────────────────┤
│         Controller Layer        │  Request/response handling
├─────────────────────────────────┤
│          Service Layer          │  Business logic, AI prompt construction
├─────────────────────────────────┤
│        Data Access Layer        │  DB queries, external API calls
└─────────────────────────────────┘
```

---

## Authentication

| Route group | Method |
|---|---|
| `/api/internal/*` | `X-Internal-Key` header — value must match `VITE_EMIRA_SECRET` |
| `/api/contact`, `/api/business-setup` | Public (rate-limited) |

---

## API Endpoints

### Health
| Method | Path | Description |
|---|---|---|
| `GET` | `/actuator/health` | Liveness check — used for cold-start pre-warm ping |

### Emira AI
| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/internal/emira/analyse` | Streams SSE analysis response from AI model |
| `GET` | `/api/v1/internal/emira/history` | Returns list of saved analysis reports |
| `GET` | `/api/v1/internal/emira/history/:id` | Returns full text of a single report |
| `DELETE` | `/api/v1/internal/emira/history/:id` | Deletes a report |

### Public Forms
| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/contact` | Contact form submission |
| `POST` | `/api/v1/business-setup` | Business setup enquiry |

---

## Streaming (Emira)

`POST /api/internal/analyse` returns a **Server-Sent Events (SSE)** stream.

```
Content-Type: text/event-stream

data: {"content": "chunk of text..."}
data: [DONE]
```

Frontend reads the stream via `ReadableStream`, accumulates chunks into Zustand store, then on `[DONE]` fires a Sonner toast prompting the user to view the saved report from history.

---

## Cold Start

Fly.io spins down idle instances. `App.jsx` fires a silent `GET /actuator/health` ping on every page load to pre-warm the server before any user action.
