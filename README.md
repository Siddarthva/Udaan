# Udaan Platform

Udaan is a full-stack platform consisting of a production-ready Node.js/Express backend and a modern React + Vite frontend. The architecture is designed as a modular monolith with real-time capabilities (Socket.IO), role-based features, and a rich interactive UI.

---

## Project Structure

- `backend/` – Node.js/Express API, authentication, business logic, data access, and real-time Socket.IO server.
  - `src/app.js` – Express app initialization, middleware, and route mounting.
  - `src/server.js` – HTTP + Socket.IO server bootstrap.
  - `src/config/` – Database (PostgreSQL via Knex) and Redis configuration.
  - `src/jobs/` – Background jobs and schedulers.
  - `src/middleware/` – Cross-cutting concerns like authentication.
  - `src/modules/`
    - `auth/` – Auth controllers, services, repositories, and `user.model.js`.
    - `discovery/` – Discovery-related services.
    - `investments/` – Investment domain services.
    - `mentorship/` – Mentorship domain services.
    - `messaging/` – Message repository and real-time messaging integration.
    - `notifications/` – Notifications domain (server-side).
    - `projects/` – Project controllers, models, repositories, routes, and services.
    - `users/` – User-related domain logic.
  - `src/services/cache.service.js` – Caching layer (Redis-based).
  - `src/utils/` – Shared backend utilities.

- `frontend/` – React 19 + Vite SPA with Tailwind CSS 4, framer-motion, GSAP, and Zustand state management.
  - `src/main.jsx` – React root, smooth scrolling (Lenis) setup.
  - `src/App.jsx` – Top-level application shell.
  - `src/app/Providers.jsx` – Global providers (e.g., React Query, routing, stores).
  - `src/app/Routes.jsx` – Client-side routing configuration.
  - `src/layouts/` – High-level layouts (Auth, Dashboard, Main, Public).
  - `src/pages/` – Top-level pages (Landing, Notifications, Settings, 404, etc.).
  - `src/components/` – Reusable UI components, overlays, animations, models, and layout pieces.
  - `src/features/` – Domain-specific UI flows (auth, dashboard, feed, funding, mentors, messaging, profile, projects, sponsor).
  - `src/services/` – Frontend services (API clients, mock DB, domain services).
  - `src/store/` – Zustand stores for domain and UI state.
  - `src/config/` – Platform- and role-related configuration.
  - `src/data/` – Static/dummy dataset used to drive UI and prototypes.

---

## Tech Stack

**Backend**
- Node.js / Express (CommonJS)
- PostgreSQL via Knex
- Redis for caching and real-time support
- Socket.IO for real-time messaging and notifications
- JSON Web Tokens (JWT) for auth
- Zod for validation
- Security and hardening: Helmet, CORS, rate limiting, bcrypt for password hashing

**Frontend**
- React 19 with Vite
- React Router for routing
- Zustand for state management
- @tanstack/react-query for data fetching/caching
- Tailwind CSS 4 for styling
- framer-motion + GSAP + Lenis for motion and smooth scrolling
- Axios for HTTP calls
- react-hook-form for forms
- react-hot-toast for notifications
- lucide-react for icons

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm or yarn
- PostgreSQL instance (local or remote)
- Redis instance (local or remote)

### Environment Variables

Create a `.env` file in `backend/` with (at minimum):

```bash
PORT=8000
CLIENT_ORIGIN=http://localhost:5173
DATABASE_URL=postgres://user:password@localhost:5432/udaan
REDIS_URL=redis://localhost:6379
JWT_SECRET=super_secret_jwt_key
```

Adjust values to match your local or deployment setup. Additional environment variables may be used by specific modules (auth, projects, etc.).

---

## Running the Backend

From the project root:

```bash
cd backend
npm install
npm run dev   # uses nodemon
# or
npm start     # production-style start
```

The backend will start on `http://localhost:8000` by default and boot a Socket.IO server with CORS configured to allow the frontend origin defined in `CLIENT_ORIGIN`.

---

## Running the Frontend

From the project root:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` (Vite default). Ensure `CLIENT_ORIGIN` in the backend `.env` matches this URL during local development.

To build for production:

```bash
cd frontend
npm run build
npm run preview
```

---

## Key Features

- **Modular backend architecture**
  - Auth, projects, investments, mentorship, discovery, messaging, notifications, and users are isolated in their own modules.
  - Shared services (e.g., caching, database, Redis) live under `services/` and `config/`.

- **Real-time capabilities**
  - Socket.IO server created in `backend/src/server.js`.
  - Rooms and event handlers for messaging/notifications.

- **Rich, animated UI**
  - Smooth scrolling and motion-heavy UI via Lenis, GSAP, and framer-motion.
  - Reusable UI primitives in `frontend/src/components/ui` and higher-level overlays such as scenario simulators and dashboards.

- **Role- and domain-based UX**
  - Role configuration under `frontend/src/config/roles.js`.
  - Domain features split into feature folders (projects, sponsors, funding, mentors, messaging, etc.).

- **Mock data for rapid iteration**
  - Static datasets in `frontend/src/data` to simulate real backend responses for dashboards, feeds, portfolios, funding pipelines, etc.

---

## Development Notes

- Linting is configured for the frontend via ESLint. Run:

```bash
cd frontend
npm run lint
```

- Testing scripts currently act as placeholders on the backend. You can integrate your preferred test framework (e.g., Jest, Vitest) later.

- The existing `frontend/README.md` is the default Vite template README; this root-level README supersedes it as the primary project documentation.

---

## Deployment Overview

- **Backend** can be deployed as a Node.js service (e.g., on a VM or container platform) with environment variables for PostgreSQL, Redis, and CORS.
- **Frontend** builds into static assets using Vite that can be served from any static hosting (CDN, object storage, etc.).
- Configure your reverse proxy (e.g., Nginx, API gateway) to route:
  - `/api/*` → backend server
  - `/socket.io/*` → same backend (for Socket.IO)
  - `/` → frontend static files

---

## License

Internal / Private project. Add a formal license here if you plan to open source or distribute Udaan.
