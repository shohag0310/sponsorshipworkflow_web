export const menuConfig = [
  // Common - All roles
  {
    label: "Dashboard",
    path: "/",
    roles: ["Requestor", "Manager", "FinanceAdmin", "SystemAdmin"],
  },

  // Requestor Menu
  {
    label: "My Requests",
    path: "/my-requests",
    roles: ["Requestor"],
  },
  {
    label: "Create Request",
    path: "/create-request",
    roles: ["Requestor"],
  },

  // Manager Menu
  {
    label: "Pending Approvals",
    path: "/pending-approvals",
    roles: ["Manager"],
  },

  // Finance Menu
  {
    label: "Pending Review",
    path: "/pending-review",
    roles: ["FinanceAdmin"],
  },

  // SystemAdmin Menu
  {
    label: "All Requests",
    path: "/all-requests",
    roles: ["SystemAdmin"],
  },
  {
    label: "Workflow History",
    path: "/workflow-history",
    roles: ["SystemAdmin"],
  },
  {
    label: "Sponsorship Types",
    path: "/sponsorship-types",
    roles: ["SystemAdmin"],
  },
];