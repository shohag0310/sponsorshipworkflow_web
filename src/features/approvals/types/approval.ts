export type ApprovalAction = "Approve" | "Reject";

export type ApprovalRequest = {
  requestId: string;
  action: ApprovalAction;
  remarks?: string;
};

export type ApprovalActionDto = {
  remarks?: string;
};