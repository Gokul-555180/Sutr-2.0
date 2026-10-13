# Sutr API

Base URL in local development: `http://localhost:3001/api`

All responses are JSON. Invalid input returns:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request.",
    "details": [{ "path": "marks", "message": "Number must be less than or equal to 100" }]
  }
}
```

The API accepts JSON bodies up to 100 KB and deliberately does not return stack traces.

## `GET /health`

Returns API liveness.

```json
{ "status": "ok", "service": "sutr-api" }
```

## `GET /scholarships`

Searches the local dataset and paginates results.

Optional query parameters:

| Parameter | Meaning |
| --- | --- |
| `q` | Case-insensitive name/provider/description search |
| `state` | Student state filter |
| `course` | Course filter |
| `courseLevel` | Degree-level filter |
| `academicYear` | Integer year (1–12) |
| `recordType` | `verified` or `demo` |
| `sort` | `recommended`, `verified_first`, `name`, or `provider` |
| `page` | One-based page; default `1` |
| `limit` | 1–50; default `12` |

```json
{
  "results": [{ "id": "demo-kerala-stem-01", "name": "…", "recordType": "demo" }],
  "total": 63,
  "page": 1,
  "limit": 12
}
```

Empty arrays in a record are not interpreted as unrestricted unless the related `*Requirement` field is explicitly `not_required`.

## `GET /scholarships/:id`

Returns `{ "scholarship": Scholarship }`, or a `404` `NOT_FOUND` error.

## `POST /scholarships/match`

Receives a partial student profile and returns every local record in deterministic rank order. A rank is a deterministic navigation aid, not a likelihood of funding.

```json
{
  "state": "Kerala",
  "domicile": "Kerala",
  "courseLevel": "Undergraduate",
  "course": "Engineering",
  "academicYear": 2,
  "institutionType": "Government",
  "annualFamilyIncome": 250000,
  "marks": 78,
  "category": "OBC"
}
```

Response: `{ "matches": MatchResult[], "total": number }`. Each match includes the source `scholarship`, a server-computed `assessment`, ranking `score`, and concise matching reasons.

## `POST /eligibility/evaluate`

The server loads the record by ID; client eligibility decisions are never trusted.

```json
{
  "scholarshipId": "demo-kerala-stem-01",
  "profile": { "state": "Kerala", "course": "Engineering" }
}
```

Response: `{ "assessment": EligibilityAssessment }` with `likely_eligible`, `needs_more_information`, or `likely_not_eligible`; all criterion results; missing profile information; source references; record type; and a preliminary-assessment disclaimer.

## `POST /roadmaps`

```json
{
  "scholarshipId": "demo-kerala-stem-01",
  "profile": { "state": "Kerala" }
}
```

Returns `201` and `{ "roadmap": GeneratedRoadmap }`. This generates tasks only. The API does not store roadmaps, task completion, saved opportunities, profiles, applications, or submissions. The frontend persists those in browser `localStorage`.
