# Sponsorship Workflow System

This is a workflow-based sponsorship approval system with role-based access and multi-stage approval.

## Live Test Links
- Frontend: https://sponsorshipworkflow-web.vercel.app
- Backend API: https://sponsorshipworkflow-api.onrender.com/api
- Swagger: https://sponsorshipworkflow-api.onrender.com/swagger/index.html

## Repositories
- API: https://github.com/shohag0310/sponsorshipworkflow_api.git
- Web: https://github.com/shohag0310/sponsorshipworkflow_web.git

## Readme Structure (3 files)
1. Master (this file): project summary, links, assessment view
2. Web README: [README.web.md](C:\Users\Shohag\source\repos\SponsorshipWorkflowFrontEnd\sponsorshipworkflow\README.web.md)
3. API README: [README.api.md](C:\Users\Shohag\source\repos\SponsorshipWorkflowFrontEnd\sponsorshipworkflow\README.api.md)

## Test Accounts
- `requestor@test.com` / `Password123!`
- `manager@test.com` / `Password123!`
- `finance@test.com` / `Password123!`
- `admin@test.com` / `Password123!`

## Workflow Summary
- `Draft -> PendingManagerApproval -> PendingFinanceReview -> Approved`
- Rejection at manager/finance: `Rejected`
- Requestor can cancel from allowed states: `Cancelled`

## Roles
- `Requestor`
- `Manager`
- `FinanceAdmin`
- `SystemAdmin`

## 4) Architecture Explanation

### Backend Architecture
- Layered structure with clear separation:
  - `API`: controllers and HTTP concerns (auth, routing, swagger, CORS)
  - `Application`: DTOs and interfaces (use-case contracts)
  - `Domain`: core business entities and enums
  - `Infrastructure`: EF Core persistence, service implementations, workflow state transitions, seeders
- Controllers stay thin and delegate business rules to services.

### Frontend Structure
- Feature-based React organization:
  - `features/auth`, `features/requests`, `features/approvals`, `features/admin`
  - shared UI/layout in `components`
  - routing in `app/router.tsx`
  - API client/token handling in `api/client.ts`
- Protected and role-based routes enforce access boundaries in UI.

### Workflow Logic
- Core lifecycle:
  - `Draft -> PendingManagerApproval -> PendingFinanceReview -> Approved`
- Alternate outcomes:
  - manager rejection or finance rejection -> `Rejected`
  - requestor cancellation from allowed states -> `Cancelled`
- Each workflow action is recorded in approval history for traceability.

### RBAC Logic
- Roles: `Requestor`, `Manager`, `FinanceAdmin`, `SystemAdmin`
- Backend authorization via JWT role claims + `[Authorize(Roles = ...)]`
- Frontend role gating via protected routes and role-aware navigation/actions
- Access intent:
  - requestor handles own requests
  - manager handles manager-stage approvals
  - finance handles finance-stage approvals
  - system admin has broad operational visibility/control

### Database Design
- Main tables/entities:
  - `Users`
  - `SponsorshipRequests`
  - `SponsorshipTypes`
  - `ApprovalHistories`
- Key relations:
  - one user to many requests (as requestor)
  - one request to many approval history records
  - one sponsorship type to many requests
- Status enum on requests + immutable history table supports both current state and audit timeline queries.

### Assumptions and Tradeoffs
- Assumptions:
  - single sequential approval chain (manager then finance)
  - seeded accounts for evaluator convenience
  - enum-driven workflow sufficient for assessment scope
- Tradeoffs:
  - simplified operational hardening (observability, background jobs, multi-tenant controls)
  - no document upload pipeline in current scope
  - focus prioritized on architecture clarity and workflow correctness over full production depth

## Assessment Notes
This implementation is scoped for technical assessment, focused on:
- architecture and code organization
- workflow/RBAC implementation
- practical tradeoffs
- communication clarity
