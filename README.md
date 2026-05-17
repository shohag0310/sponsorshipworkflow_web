# Sponsorship Workflow Frontend

React + TypeScript + Vite frontend for the **Sponsorship Request Approval Workflow** assessment.

## Tech Stack
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

## Features Implemented
- Role-based login UI
- Dashboard per role
- Request list and details
- Create / edit sponsorship request (draft + submit flow)
- Manager and Finance approval/rejection actions
- Workflow history view
- Sponsorship type management (System Admin)
- Confirm dialogs with remarks input for approval/rejection

## Prerequisites
- Node.js 20+
- npm 10+
- Running backend API

## Environment Variables
Create `.env`:

```env
VITE_API_URL=https://localhost:7206/api
```

## Run Frontend
```bash
npm install
npm run dev
```

Default local URL:
- `http://localhost:5173`

## Build
```bash
npm run build
```

## Test Accounts
Use seeded backend users:
- `requestor@test.com` / `Password123!`
- `manager@test.com` / `Password123!`
- `finance@test.com` / `Password123!`
- `admin@test.com` / `Password123!`

## Role Mapping
- Requestor: create, draft, submit, view own, cancel
- Manager: approve/reject pending manager requests
- Finance Admin: approve/reject pending finance requests
- System Admin: all requests, workflow history, sponsorship type settings

## Notes / Tradeoffs
- Supporting document upload is not implemented yet (optional in assessment).
- Current deployment/live URLs should be added in the main project README after hosting.
