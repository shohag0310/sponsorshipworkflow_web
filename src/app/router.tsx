import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { RoleRoute } from "../auth/RoleRoute";
import DashboardLayout from "../components/layout/DashboardLayout";

// Auth Pages
import LoginPage from "../features/auth/pages/LoginPage";

// Dashboard
import DashboardPage from "../features/requests/pages/DashboardPage";

// Shared Request Pages
import RequestListPage from "../features/requests/pages/RequestListPage";
import CreateRequestPage from "../features/requests/pages/CreateRequestPage";
import RequestDetailsPage from "../features/requests/pages/RequestDetailsPage";

// Admin Pages
import WorkflowHistoryPage from "../features/admin/pages/WorkflowHistoryPage";
import SponsorshipTypesPage from "../features/admin/pages/SponsorshipTypesPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      // Dashboard - All roles
      { index: true, element: <DashboardPage /> },

      // My Requests - Requestor
      {
        path: "my-requests",
        element: (
          <RoleRoute allowedRoles={["Requestor"]}>
            <RequestListPage />
          </RoleRoute>
        ),
      },

      // Create Request - Requestor
      {
        path: "create-request",
        element: (
          <RoleRoute allowedRoles={["Requestor"]}>
            <CreateRequestPage />
          </RoleRoute>
        ),
      },

      // Request Details - All roles
      {
        path: "request/:id",
        element: (
          <RoleRoute allowedRoles={["Requestor", "Manager", "FinanceAdmin", "SystemAdmin"]}>
            <RequestDetailsPage />
          </RoleRoute>
        ),
      },

      // Edit Request - Requestor (own drafts only)
      {
        path: "request/:id/edit",
        element: (
          <RoleRoute allowedRoles={["Requestor"]}>
            <CreateRequestPage />
          </RoleRoute>
        ),
      },

      // Pending Approvals - Manager
      {
        path: "pending-approvals",
        element: (
          <RoleRoute allowedRoles={["Manager"]}>
            <RequestListPage />
          </RoleRoute>
        ),
      },

      // Pending Review - FinanceAdmin
      {
        path: "pending-review",
        element: (
          <RoleRoute allowedRoles={["FinanceAdmin"]}>
            <RequestListPage />
          </RoleRoute>
        ),
      },

      // All Requests - SystemAdmin
      {
        path: "all-requests",
        element: (
          <RoleRoute allowedRoles={["SystemAdmin"]}>
            <RequestListPage />
          </RoleRoute>
        ),
      },

      // Workflow History - SystemAdmin
      {
        path: "workflow-history",
        element: (
          <RoleRoute allowedRoles={["SystemAdmin"]}>
            <WorkflowHistoryPage />
          </RoleRoute>
        ),
      },

      // Sponsorship Types - SystemAdmin
      {
        path: "sponsorship-types",
        element: (
          <RoleRoute allowedRoles={["SystemAdmin"]}>
            <SponsorshipTypesPage />
          </RoleRoute>
        ),
      },
    ],
  },
]);