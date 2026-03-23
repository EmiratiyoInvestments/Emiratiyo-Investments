# Blog Automation

Blog content is automatically generated and published via a Make.com scenario.

- **Scenario URL:** https://eu1.make.com/1051309/scenarios/4497598/edit

---

## What It Does

1. Triggers on a schedule (or manually)
2. Generates a blog article using an AI model (GPT or Claude)
3. Structures the output as a Sanity-compatible document
4. Publishes the article directly to Sanity via the Sanity API
5. The article becomes immediately available on the live site via `BlogsPage.jsx`

---

## Dependencies

| Dependency | Detail |
|---|---|
| Make.com account | Access to scenario `4497598` |
| Sanity API token | `VITE_SANITY_TOKEN` — needs write access |
| Sanity dataset | `production` |
| Sanity project ID | `kgljxpj0` |
| AI provider | Configured inside the Make.com scenario |

---

## Trigger

- Scheduled (configured in Make.com) **or** manually triggered from the Make.com dashboard
- No code changes required to run it

---

## How to Run Manually

1. Open https://eu1.make.com/1051309/scenarios/4497598/edit
2. Click **Run once** in the bottom toolbar
3. Monitor the execution log for errors
4. New article appears in Sanity and on the live site immediately

---

## How to Maintain

| Task | Action |
|---|---|
| Change publishing frequency | Edit the schedule trigger in Make.com |
| Change AI prompt / article style | Edit the AI module inside the scenario |
| Change Sanity target dataset | Update the Sanity module connection in Make.com |
| Scenario breaks | Check Make.com execution history for the failing module and fix the connection |

---

## Sanity Document Type

Articles are published as the `post` document type in Sanity. Fields include `title`, `slug`, `body` (Portable Text), `category`, `publishedAt`, and `mainImage`.
