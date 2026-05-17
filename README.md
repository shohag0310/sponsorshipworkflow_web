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

## Assessment Notes
This implementation is scoped for technical assessment, focused on:
- architecture and code organization
- workflow/RBAC implementation
- practical tradeoffs
- communication clarity
