import type { RequestStatusType } from "../../constants/requestStatus";

const statusLabels: Record<RequestStatusType, string> = {
  Draft: "Draft",
  PendingManagerApproval: "Pending Manager Approval",
  PendingFinanceReview: "Pending Finance Review",
  Approved: "Approved",
  Rejected: "Rejected",
  Cancelled: "Cancelled",
};

const statusStyles: Record<RequestStatusType, string> = {
  Draft: "bg-slate-100 text-slate-600 border-slate-200",
  PendingManagerApproval: "bg-amber-100 text-amber-700 border-amber-200",
  PendingFinanceReview: "bg-blue-100 text-blue-700 border-blue-200",
  Approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Rejected: "bg-red-100 text-red-700 border-red-200",
  Cancelled: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function StatusBadge({ status }: { status: RequestStatusType }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || statusStyles.Draft}`}>
      {statusLabels[status] || status}
    </span>
  );
}