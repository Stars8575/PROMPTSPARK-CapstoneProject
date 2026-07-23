# PromptSpark API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require a header:
`Authorization: Bearer <token>`

---

## Auth

### POST /auth/register
Body: `{ "name": string, "email": string, "password": string (min 6 chars) }`
Response `201`: `{ "message": string, "userId": string }`

### POST /auth/login
Body: `{ "email": string, "password": string }`
Response `200`: `{ "token": string, "user": { "id", "name", "email" } }`

### GET /auth/me  🔒
Response `200`: current user object (no password field)

---

## Prompts  🔒 (all routes require auth)

### GET /prompts
Query params: `search` (string, partial title match), `category` (string)
Response `200`: array of prompt objects

### GET /prompts/:id
Response `200`: single prompt object

### GET /prompts/:id/versions
Response `200`: array of version snapshots, newest first

### POST /prompts
Body: `{ "title": string, "content": string, "category": string }`
Response `201`: created prompt

### PUT /prompts/:id
Body: `{ "title": string, "content": string, "category": string }`
Saves the previous state as a new version before updating.
Response `200`: updated prompt

### POST /prompts/:id/restore/:versionId
Restores prompt to a previous version (current state is saved as a new version first).
Response `200`: restored prompt

### DELETE /prompts/:id
Response `200`: `{ "message": "Prompt deleted" }`

---

## AI  🔒

### POST /ai/run
Body: `{ "content": string, "provider": "groq", "model"?: string, "promptId"?: string }`
Response `200`: `{ "output": string, "usage": {...}, "model": string, "costUsd": number }`

### POST /ai/compare
Runs an A/B test — two variants, same model, in parallel.
Body: `{ "contentA": string, "contentB": string, "provider": "groq", "model"?: string }`
Response `200`: `{ "abTestGroup": string, "variantA": {...}, "variantB": {...} }`

---

## Analytics  🔒

### GET /analytics/summary
Response `200`:
```json
{
  "totals": { "totalRuns": number, "totalTokens": number, "totalCost": number },
  "costByDay": [{ "date": "YYYY-MM-DD", "cost": number, "tokens": number }],
  "tokensByModel": [{ "model": string, "tokens": number, "runs": number }]
}
```

---

## Rate Limits
- General API: 200 requests / 15 min per IP
- Auth routes: 20 requests / 15 min per IP