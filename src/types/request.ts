export type RequestStatus =
  | "Draft"
  | "PendingManagerApproval"
  | "PendingFinanceReview"
  | "Approved"
  | "Rejected"
  | "Cancelled";

export type Request = {
  id: string;
  title: string;
  department: string;
  sponsorshipType: string;
  eventName: string;
  eventDate: string;
  amount: number;
  purpose: string;
  expectedBenefit: string;
  remarks?: string;
  status: RequestStatus;
  createdAt: string;
};