# Sutr

**Everything connected. Nothing complicated.**

Sutr is a local-first scholarship discovery and planning MVP for Indian students, with focused support for Kerala-related records. It helps a student create a minimal study profile, search the local dataset, receive a deterministic preliminary eligibility assessment, prepare documents, and manage application-preparation roadmaps.

It does not use AI services, API keys, accounts, or a database.

## Technology

- Frontend: React, Vite, TypeScript, Lucide React
- Backend: Node.js, Express, TypeScript, Zod
- Data: local JSON dataset
- User progress: browser `localStorage`

## Features

- Search, filters, pagination, and verified/demo filtering backed by the API
- Profile inputs designed to avoid unnecessary sensitive information
- Deterministic matching and eligibility evaluation with satisfied, failed, unknown, and not-applicable criteria
- Clear preliminary-assessment and demo-record warnings
- Document preparation checklists with local progress states
- Deterministic, provider-aware application roadmaps that can be resumed or deleted
- Saved opportunities and dashboard numbers calculated from actual browser data
- Responsive keyboard-accessible interface, visible focus states, and reduced-motion support

## Start locally

Prerequisite: Node.js 20 or newer (Node 22 used during development).

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The API runs on `http://localhost:3001`.

Run services separately if preferred:

```bash
npm run dev:backend
npm run dev:frontend
```

`VITE_API_BASE_URL` can override the frontend's API root. It defaults to `http://localhost:3001/api`; no other environment variables are required.

## GitHub Pages

The repository includes a GitHub Actions workflow that deploys the Vite frontend to GitHub Pages when `main` changes. GitHub Pages cannot run the Express API. For a functional hosted deployment, host `backend/` on an HTTPS Node service and set the repository Actions variable `VITE_API_BASE_URL` to that service's `/api` URL before deployment. Without it, the published interface loads but cannot retrieve scholarship data.

## Checks

```bash
npm run typecheck
npm run build
npm test
```

## API

The API is documented in [docs/API.md](docs/API.md).

- `GET /api/health`
- `GET /api/scholarships`
- `GET /api/scholarships/:id`
- `POST /api/scholarships/match`
- `POST /api/eligibility/evaluate`
- `POST /api/roadmaps`

## Dataset and verification

The local dataset at `backend/data/scholarships.json` contains **63 records** generated reproducibly by `backend/scripts/generate-dataset.mjs`:

- 3 records with official Kerala/Government sources or official archived source material
- 60 clearly labelled, fictional Sutr demonstration records

Some officially sourced records are intentionally marked `official_details_incomplete`: the available official page is a portal or guide and does not document every individual scheme condition. The app renders unknown details as unknown; it does not infer them. The archived PM YASASVI reference is not presented as a current application opportunity.

Read [docs/DATA_POLICY.md](docs/DATA_POLICY.md) for the detailed policy. This dataset is a curated MVP sample and does **not** cover every Indian scholarship.

## Matching and eligibility

The backend is the source of truth for matches and eligibility. It never accepts a client-computed result.

- A documented failed required rule yields `likely_not_eligible`.
- A missing value for a documented required rule yields `needs_more_information`, unless another required rule failed.
- `likely_eligible` is returned only when every applicable documented required rule is satisfied.
- Unknown source details remain unknown. Optional/unknown record rules do not become mandatory by assumption.
- Scores are deterministic ranking aids only; they are not a probability of award or approval.

## Persistence and privacy

The API has no server-side user account or progress storage. Profile values, saved IDs, document states, and roadmap task states are stored only in the current browser's `localStorage`. Invalid stored JSON is ignored safely. Clearing browser site data removes this local progress.

Do not enter Aadhaar numbers, bank details, passwords, or documents into Sutr. Always read the current provider page and use official channels to apply.

## Known limitations

- Local JSON is not a comprehensive or live scholarship catalogue.
- Official application dates, awards, documents, and eligibility rules can change; unknown information is deliberately not filled in.
- The product does not submit applications or authenticate users.
- Demo records exist only to make the matching and planning workflow testable at useful scale.
