# Personal To‑Do List Frontend (SvelteKit)

Modern, minimalist to‑do list UI with Ocean Professional theme (blue & amber accents). Users can create, update, complete, and delete tasks and filter between All / Active / Completed.

## Getting started

1) Install dependencies
```bash
npm install
```

2) Configure environment (dev)
- Copy `.env.example` to `.env`
- Ensure your backend is running locally and note its URL (e.g. http://localhost:4000)
- By default, the frontend uses `VITE_API_BASE=/api` and Vite dev proxy with `VITE_DEV_PROXY_TARGET=http://localhost:4000`
- This means requests to `/api/*` are proxied to your backend at `http://localhost:4000/api/*`

3) Run the dev server:
```bash
npm run dev
```

Open http://localhost:3000

### Production builds
In production, you can:
- Keep `VITE_API_BASE=/api` if the frontend and backend are served together under the same host with an `/api` prefix.
- Or set an absolute URL for `VITE_API_BASE`, e.g. `https://api.example.com`.

## Configuration

Environment variables (see `.env.example`):
- `VITE_API_BASE`
  - Path or absolute URL used by the frontend for API calls.
  - Defaults to `/api`. Recommended for development with proxy.
- `VITE_DEV_PROXY_TARGET` (dev-only)
  - The backend URL that Vite proxies to while running `npm run dev`.
  - Example: `http://localhost:4000`

If your backend does not use the `/api` prefix, you can edit `vite.config.ts` and enable the rewrite to strip `/api` before forwarding.

## Expected Backend API

The UI integrates with these endpoints:

- GET `${VITE_API_BASE}/tasks` → Task[]
- POST `${VITE_API_BASE}/tasks` body: { title: string } → Task
- PATCH `${VITE_API_BASE}/tasks/:id` body: { title?: string; completed?: boolean } → Task
- DELETE `${VITE_API_BASE}/tasks/:id` → { success: true }

Task type:

```ts
type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}
```

Responses must be JSON. Non‑2xx responses should include a message or text for error feedback.

## Troubleshooting 404 / network errors when adding a task

- If you see “API 404” when calling `/api/tasks` in development:
  - Ensure your backend exposes `/api` routes, e.g. `http://localhost:4000/api/tasks`
  - Ensure `.env` contains `VITE_DEV_PROXY_TARGET=http://localhost:4000`
  - Restart the dev server after changing `.env`
  - If your backend uses different paths (no `/api`), open `vite.config.ts` and enable the commented `rewrite` that strips `/api`.

- If you see “Network error” or “Request timed out”:
  - Confirm the backend is running and reachable at `VITE_DEV_PROXY_TARGET`
  - If not using the proxy, set `VITE_API_BASE` to an absolute URL pointing to your backend

The UI will display toasts with hints when the backend is unreachable or proxy is misconfigured.

## Design

- Ocean Professional theme
- Clean UI, subtle shadows, rounded corners
- Smooth transitions, gentle gradients
- Accessible controls (checkboxes, buttons with labels)
- Optimistic UI updates with error toasts

## Scripts

- `npm run dev` – start dev server
- `npm run build` – build for production
- `npm run preview` – preview production build
- `npm run check` – type/check SvelteKit
- `npm run lint` – lint
- `npm run test` – unit tests (if added)

