export const RequestStatus = {
  Draft: "Draft",
  PendingManagerApproval: "PendingManagerApproval",
  PendingFinanceReview: "PendingFinanceReview",
  Approved: "Approved",
  Rejected: "Rejected",
  Cancelled: "Cancelled",
} as const;

export type RequestStatusType = (typeof RequestStatus)[keyof typeof RequestStatus];