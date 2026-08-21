# UDAAN Innovation Platform

UDAAN is a full-stack platform connecting **Founders (Innovators)**, **Investors (Sponsors)**, and **Mentors** to accelerate startup incubation, funding, advisory, and real-time collaboration.

---

## 🔄 End-to-End User Flow

<<<<<<< HEAD
```mermaid
flowchart TD
    A[1. User Registration] --> B[2. Complete Profile]
    B --> C[3. Founder Creates Startup]
    C --> D[4. Upload Pitch Deck & Assets]
    D --> E[5. Investors/Mentors Browse Startups]
    E --> F[6. Save Startup to Watchlist]
    E --> G[7. Investor Expresses Interest]
    E --> H[8. Mentor Sends Advisory Request]
    G --> I[9. Founder Reviews Interests/Requests]
    H --> I
    I --> J[10. Founder Accepts Request]
    J --> K[11. 1-to-1 Realtime Messaging]
=======
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
>>>>>>> ccbf6e2144212e6679121a5d1c10013a80a074f5
```

1. **User Registration & Auth**: Signup as an Innovator (Founder), Sponsor (Investor), or Mentor.
2. **Profile Completion**: Update profile details, bio, skills, LinkedIn/social links, and contact information.
3. **Launch Startup**: Founders launch new ventures with details on domain, stage, and funding goals.
4. **Pitch Deck Upload**: Secure file upload of pitch decks, logos, and cover images to Supabase Storage.
5. **Discovery & Browse**: Investors and Mentors filter ventures by industry domain and funding stage.
6. **Watchlist Management**: Investors save promising startups to their personal watchlist.
7. **Investor Interest**: Investors express funding interest with customized notes.
8. **Mentorship Advisory**: Mentors submit mentorship requests to founders.
9. **Founder Review**: Founders manage received investor interest and mentorship requests.
10. **Request Acceptance**: Founders accept mentorship or investor connections.
11. **Realtime Messaging**: Instant 1-to-1 chat between connected users powered by Supabase Realtime.

---

## 🏗️ Architecture & Project Structure

The project follows a **Modular Monolith** architecture with clean separation of concerns:

```
UDAAN/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment & Supabase single client
│   │   ├── middleware/      # Auth, global error handler, validators
│   │   ├── modules/
│   │   │   ├── auth/        # Auth controller, service, routes
│   │   │   ├── startup/     # Startup CRUD, watchlist, interest, mentor requests
│   │   │   ├── upload/      # Supabase Storage bucket uploads
│   │   │   └── messages/    # 1-to-1 Realtime messaging
│   │   ├── utils/           # ApiError, ApiResponse, constants, validators
│   │   ├── app.js           # Express app definition & route binding
│   │   └── server.js        # Node.js server entry point
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance & TanStack Query custom hooks
│   │   ├── components/      # Reusable UI components (Navbar, Sidebar, Modal, Card)
│   │   ├── pages/           # Dashboard, Discover, Projects, Messages, Watchlist, Profile
│   │   ├── store/           # Zustand state management stores
│   │   ├── utils/           # Protected routes, role guards, helpers
│   │   ├── App.jsx          # Router & page lazy loading
│   │   └── main.jsx         # Application entry
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml       # Orchestrates frontend, backend & Nginx proxy
├── nginx.conf               # Production reverse proxy
└── .github/workflows/ci.yml # Automated CI pipeline
```

---

## ⚡ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS 4, TanStack Query (v5), Zustand, React Hook Form, Zod, React Hot Toast, Lucide React |
| **Backend** | Node.js (v20), Express, Supabase JS SDK, JWT Auth, Multer, Helmet, Morgan, Swagger UI Express |
| **Database & Storage** | Supabase PostgreSQL, Supabase Auth, Supabase Storage Buckets |
| **Realtime Messaging** | Supabase Realtime Channels (1-to-1 Founder ↔ Investor / Mentor messaging) |
| **Deployment** | Docker, Nginx, Docker Compose, GitHub Actions |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Docker & Docker Compose (optional for containerized deployment)

### 1. Environment Setup

Create `.env` inside `backend/`:

```env
PORT=8000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
JWT_ACCESS_SECRET=access-secret-key
JWT_REFRESH_SECRET=refresh-secret-key
```

### 2. Local Development

**Start Backend**:
```bash
cd backend
npm install
npm run dev
```
- Server: `http://localhost:8000`
- Interactive Swagger API Documentation: `http://localhost:8000/api/docs`

**Start Frontend**:
```bash
cd frontend
npm install
npm run dev
```
- App: `http://localhost:5173`

---

## 🐳 One-Command Docker Deployment

To launch the full production environment with Nginx reverse proxy:

```bash
docker-compose up -d --build
```

- Web Application: `http://localhost`
- API Gateway: `http://localhost/api/`
- Interactive API Docs: `http://localhost/api/docs`

---

## 🧪 Testing

Run backend integration test suite:

```bash
cd backend
npm test
```

Run frontend build check:

```bash
cd frontend
npm run build
```

---

## 📄 API Documentation

<<<<<<< HEAD
Interactive Swagger OpenAPI specs are served at **`/api/docs`** on the backend server.
=======
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

>>>>>>> ccbf6e2144212e6679121a5d1c10013a80a074f5
