# Task Management Frontend — Modernized

A TypeScript rebuild of the supplied task-management frontend using React 19, Vite, React Router, Material UI, TanStack Query, and Axios.

## Runtime

- Node.js 24 LTS (recommended)
- npm 10 or newer
- Existing NestJS backend, expected at `http://localhost:3000` by default

The app is configured for the current React 19.3 line and Vite 8.3 line using semver ranges. Run `npm install` to resolve the exact published patch versions and generate `package-lock.json`.

## Quick start

```bash
cp .env.example .env
npm install
npm run dev
```

Open <http://localhost:3001>. Routing uses hash URLs (for example, `/#/signin`) to preserve the original frontend's static-hosting compatibility.

Production build and local preview:

```bash
npm run typecheck
npm run lint
npm run build
npm run preview
```

## Backend configuration

Set `VITE_API_BASE_URL` in `.env` to your NestJS API origin. Do not include a trailing slash.

The frontend retains the API contract inferred from the original source:

- `POST /auth/signin` — `{ username, password }`, expects `{ accessToken, username }`
- `POST /auth/signup` — `{ username, password }`
- `GET /tasks?status=OPEN&search=...`
- `POST /tasks` — `{ title, description }`
- `PATCH /tasks/:id/status` — `{ status }`
- `DELETE /tasks/:id`

Task statuses are `OPEN`, `IN_PROGRESS`, and `DONE`. Bearer tokens are stored in `localStorage` under `accessToken`, matching the original app. The API is expected to return task IDs, titles, descriptions, and statuses in the same shape as before.

## Notes before deployment

1. Confirm the backend's CORS configuration permits the deployed frontend origin.
2. Confirm the exact NestJS response shape for error messages and task objects; the frontend handles common NestJS validation errors but cannot validate an unavailable backend.
3. `VITE_API_BASE_URL` is bundled into the client at build time and must not contain secrets.
4. The supplied project contained frontend source only. No backend, API tests, database schema, or credentials were included, so live API integration has not been exercised here.
5. For a production system, consider moving authentication to secure, HttpOnly cookies if the backend can support them; localStorage token storage is retained for compatibility with the supplied backend.

## Main structure

```text
src/
  app/              Query client, routing and protected routes
  components/       Reusable error, task and filter UI
  features/auth/    Sign-in and sign-up pages
  features/tasks/   Task list and task creation pages
  lib/              API client and error helpers
  types/            Shared API types
```
