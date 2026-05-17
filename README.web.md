# Sponsorship Workflow Web (Frontend)

Frontend for the sponsorship workflow system.

## Tech Stack
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

## Repository
- https://github.com/shohag0310/sponsorshipworkflow_web.git

## Local Run Guide

## Prerequisites
- Node.js 20+
- npm 10+

## Setup
1. Clone:
```bash
git clone https://github.com/shohag0310/sponsorshipworkflow_web.git
cd sponsorshipworkflow_web
```

2. Create `.env`:
```env
VITE_API_URL=https://localhost:7206/api
```

3. Install and run:
```bash
npm install
npm run dev
```

4. Open:
- `http://localhost:5173`

## Scripts
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

## Frontend Structure
- `src/features/auth`: login/auth flow
- `src/features/requests`: dashboard, list, details, create/edit
- `src/features/approvals`: manager/finance actions
- `src/features/admin`: sponsorship types, workflow history
- `src/components`: shared UI/layout
- `src/app/router.tsx`: protected + role-based routes
- `src/api/client.ts`: axios instance and token handling

## Role-Based UI Routes
- Requestor: `my-requests`, `create-request`
- Manager: `pending-approvals`
- FinanceAdmin: `pending-review`
- SystemAdmin: `all-requests`, `workflow-history`, `sponsorship-types`

## Architecture Explanation (Frontend Focus)

### Backend Architecture (Context)
- Frontend integrates with a layered backend (`API`, `Application`, `Domain`, `Infrastructure`) via REST endpoints.
- UI relies on backend-enforced business rules and role authorization for workflow safety.

### Frontend Structure
- Feature-first module organization keeps request/approval/admin concerns separated.
- Shared components and centralized API client reduce duplication and improve maintainability.

### Workflow Logic (UI View)
- Requestor creates/submits and manages own requests.
- Manager and Finance views are role-filtered to their approval stages.
- Request details pages surface status progression and action history.

### RBAC Logic
- JWT token is stored client-side and decoded for role-aware rendering.
- `ProtectedRoute` and `RoleRoute` control access to page-level routes.
- Navigation menu and quick actions are role-dependent.

### Database Design (Context)
- Frontend consumes normalized backend DTOs derived from core entities:
  - users, sponsorship requests, sponsorship types, approval histories.
- UI mapping converts backend status codes into presentation-friendly labels.

### Assumptions and Tradeoffs
- Frontend assumes backend is the source of truth for authorization and workflow transitions.
- Optimized for clarity and speed of delivery over advanced offline state sync or complex caching.
- Scope intentionally avoids heavy state frameworks to keep assessment implementation focused.

## Live URL
- https://sponsorshipworkflow-web.vercel.app

## Notes
- Uses JWT from backend and reads role from token claims.
- Dashboard cards use backend endpoint: `GET /api/requests/dashboard-stats`.
