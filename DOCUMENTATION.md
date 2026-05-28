# Spendly — Project Documentation

## Project Overview

Spendly is a full-stack expense tracking application that helps users record expenses, set and track budgets, and view analytics. It includes user authentication (email/password and Google Sign-In), password recovery via email, JWT-based protection for API routes, and a polished React frontend with Framer Motion animations and Tailwind CSS.

## Architecture (High level)

- Frontend: React + Vite application (SPA) that uses an API client to communicate with the backend and stores the auth token in `localStorage`.
- Backend: Node.js + Express REST API with MongoDB (Mongoose) for data persistence. Nodemailer is used for password reset emails.
- Data: MongoDB (recommended: Atlas). Models: `User`, `Expense`, `Budget`.

## Tech Stack

- Frontend: React 18, Vite, Tailwind CSS, Framer Motion, React Router, @react-oauth/google
- Backend: Node.js, Express, Mongoose, JWT, bcryptjs, nodemailer, express-validator, helmet, cors

## Repository layout

See the top-level README for a full tree. Key folders:

- `backend/` — API server, controllers, models, routes, utilities
- `frontend/` — React app, components, contexts, services

Relevant files:

- [backend/server.js](backend/server.js#L1) — Express app entry
- [backend/routes/auth.js](backend/routes/auth.js#L1) — Auth routes
- [backend/routes/expenses.js](backend/routes/expenses.js#L1) — Expense routes
- [backend/routes/budgets.js](backend/routes/budgets.js#L1) — Budget routes
- [frontend/src/services/api.js](frontend/src/services/api.js#L1) — API client used by frontend
- [frontend/src/contexts/AuthContext.jsx](frontend/src/contexts/AuthContext.jsx#L1) — Authentication context

## What the project does (concise)

- Allow users to register and login (email/password and Google).
- Let authenticated users create, read, update, delete (CRUD) expenses.
- Let users create/manage budgets per category and compare budgets vs spending.
- Provide dashboard views and analytics (category breakdown, recent transactions, daily trend, etc.).
- Provide password reset flow via email with 1 hour tokens (development logs reset links to console).

## Backend details

Entry point: `backend/server.js` — sets up middleware (Helmet, CORS, rate-limiting, logging), connects to MongoDB, mounts routes, and includes error handling.

Routes (mounted under `/api`):

- Authentication (`/api/auth`):
  - `POST /register` — create user (validates name, email, password)
  - `POST /login` — sign in (returns JWT)
  - `POST /google` — Google Sign-In (accepts Google credential)
  - `POST /forgot-password` — request password reset (sends email or exposes link in dev)
  - `POST /reset-password` — reset using token
  - `GET /me` — get current user (protected)
  - `PUT /profile` — update profile (protected)
  - `DELETE /account` — delete account and associated data (protected)

- Expenses (`/api/expenses`) — all routes protected by JWT middleware:
  - `GET /` — list expenses (filters: page, limit, category, startDate, endDate, search, sortBy, order)
  - `POST /` — create expense (title, amount, category, description, date)
  - `GET /:id` — get single expense
  - `PUT /:id` — update expense
  - `DELETE /:id` — delete expense
  - `GET /stats` — aggregated stats (overview, categoryBreakdown, recent, dailyTrend)

- Budgets (`/api/budgets`) — protected:
  - `GET /` — list budgets (with spent/remaining calculation)
  - `POST /` — create or update a budget
  - `GET /comparison` — budget vs spending comparison for a period
  - `GET /:category` — get budget for a category
  - `PUT /:category` — update budget for a category
  - `DELETE /:category` — delete budget for a category

Authentication middleware: `backend/middleware/auth.js` — verifies `Authorization: Bearer <token>` and attaches `req.user`.

Models (primary fields):

- `User` (`backend/models/User.js`): `name`, `email` (unique), `password` (hashed), `googleId`, `avatar`, `preferences`.
- `Expense` (`backend/models/Expense.js`): `user` (ObjectId), `title`, `amount`, `category`, `description`, `date`, `receipt`, `tags`.
- `Budget` (`backend/models/Budget.js`): `user`, `category`, `amount`, `period`, `alerts` (enabled, threshold).

Email/password flow and security:

- Passwords hashed with `bcrypt` (salt rounds: 12).
- JWT tokens signed with `JWT_SECRET`, expiry from `JWT_EXPIRES_IN`.
- Password reset: tokens stored in-memory (development); email is sent via `backend/utils/emailService.js` using Nodemailer and configured via `.env`.

Validation: Route-level validation uses `express-validator` and `backend/middleware/validation.js`.

Rate limiting and security headers are configured in `server.js` (Helmet + `express-rate-limit`).

## Frontend details

Project entry: `frontend/src/main.jsx` and `frontend/src/App.jsx` renders a SPA wrapped with `AuthProvider`.

Key parts:

- `frontend/src/services/api.js`: encapsulates API calls, token management (stores token in `localStorage` under `spendly-token`), error handling, and helper methods for auth, expenses, budgets, and stats.
- `frontend/src/contexts/AuthContext.jsx`: manages auth state, exposes `login`, `register`, `logout`, `googleSignIn`, and `getCurrentUser` behavior. On load it checks token and fetches user.
- `frontend/src/components/` contains UI components:
  - `AuthForm.jsx` — login/register UI and Google Sign-In integration
  - `Dashboard.jsx` — main overview (uses expenses and budgets)
  - `ExpenseForm.jsx` / `ExpenseList.jsx` — create and list/manage expenses
  - `BudgetTracker.jsx` — set and view budgets
  - `Profile.jsx` / `Settings.jsx` — user profile and preferences

UX notes: The app uses Framer Motion for transitions, `react-hot-toast` for notifications, and local optimistic updates (frontend updates state immediately after a successful API response).

## Environment variables

Copy `backend/.env.example` to `backend/.env` and set these values:

- `NODE_ENV` — development/production
- `PORT` — backend port (default `3001` in README, `5000` fallback in code)
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing tokens
- `JWT_EXPIRES_IN` — e.g. `30d`
- `CLIENT_URL` — frontend origin (e.g. `http://localhost:5173`)
- `EMAIL_SERVICE` — e.g. `gmail`
- `EMAIL_USER` — email address used for Nodemailer (dev: placeholder)
- `EMAIL_PASSWORD` — app password for Gmail or SMTP credentials

Frontend: set `VITE_API_URL` in `frontend/.env` or rely on default `http://localhost:3001/api`.

## Running the project locally

Prerequisites: Node.js (v14+), NPM/Yarn, MongoDB Atlas (or local MongoDB)

Commands (from repo root):

Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your credentials
npm start
```

Frontend

```bash
cd frontend
npm install
# set Google client id in src/components/AuthForm.jsx or via env
npm run dev
```

The frontend dev server defaults to `http://localhost:5173` and backend to `http://localhost:3001`.

## API examples

Login (curl):

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@spendly.com","password":"password"}'
```

Create expense (curl):

```bash
curl -X POST http://localhost:3001/api/expenses \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <TOKEN>' \
  -d '{"title":"Lunch","amount":12.5,"category":"Food & Dining","date":"2024-01-01"}'
```

## Deployment notes

- Ensure `NODE_ENV=production`, set `MONGODB_URI` to your production cluster, and configure SMTP credentials for email features.
- The backend is a standard Express app — deployable to services like Heroku, Render, Azure App Service, or containerized with Docker.
- The frontend is a Vite app — build with `npm run build` and host static assets on Netlify, Vercel, or a static hosting service.

## Troubleshooting

- If emails are not sent, verify Gmail 2-Step Verification and app password, or check SMTP settings.
- If `GET /api/auth/me` returns unauthorized, check that the token is set in `localStorage` under `spendly-token` and that `VITE_API_URL` matches backend origin.
- For password reset links in development, the backend logs the reset URL to the console.

## Where to look next (developer pointers)

- Authentication logic: [backend/controllers/authController.js](backend/controllers/authController.js#L1)
- Password reset and Google sign-in: [backend/controllers/passwordController.js](backend/controllers/passwordController.js#L1)
- API client used across the UI: [frontend/src/services/api.js](frontend/src/services/api.js#L1)
- Main app shell and data flow: [frontend/src/App.jsx](frontend/src/App.jsx#L1)

## Credits & Guides

- See [README.md](README.md#L1) for high-level project information and setup steps.
- See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md#L1) for deployment-specific instructions.

---

If you'd like, I can:

- add API examples with sample responses for every endpoint,
- generate an OpenAPI/Swagger spec from the routes,
- or create a shorter two-page README suitable for end-users.

Tell me which follow-up you prefer.