# Personal To‑Do List Frontend (SvelteKit)

Modern, minimalist to‑do list UI with Ocean Professional theme (blue & amber accents). Users can create, update, complete, and delete tasks and filter between All / Active / Completed.

## Getting started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Configuration

Set backend API base URL via Vite env:

Create `.env` (see `.env.example`):

```
VITE_API_BASE=/api
```

If your backend runs on another host:

```
VITE_API_BASE=https://api.example.com
```

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

