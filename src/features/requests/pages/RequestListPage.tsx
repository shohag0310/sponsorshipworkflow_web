import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestApi } from "../api/requestApi";
import { approvalApi } from "../../approvals/api/approvalApi";
import { useAuth } from "../../../auth/AuthContext";
import type { Request } from "../types/request";
import StatusBadge from "../../../components/ui/StatusBadge";
import Loading from "../../../components/ui/Loading";
import EmptyState from "../../../components/ui/EmptyState";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import { toast } from "react-hot-toast/headless";

export default function RequestListPage() {
  const { role } = useAuth();
  const [data, setData] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [approveTargetId, setApproveTargetId] = useState<string | null>(null);
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, [role]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await requestApi.getAll();
      let filtered = res || [];

      const normalizedRole = role?.toLowerCase();
      if (normalizedRole === "manager") {
        filtered = filtered.filter((r: Request) => r.status === "PendingManagerApproval");
      } else if (normalizedRole === "financeadmin") {
        filtered = filtered.filter((r: Request) => r.status === "PendingFinanceReview");
      }

      setData(filtered);
    } catch {
      setError("Failed to load requests");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    setCancelTargetId(id);
  };

  const confirmCancel = async () => {
    if (!cancelTargetId) return;
    try {
      await requestApi.cancel(cancelTargetId);
      toast.success("Request cancelled");
      setCancelTargetId(null);
      load();
    } catch {
      toast.error("Failed to cancel request");
    }
  };

  const handleApprove = async (id: string) => {
    setApproveTargetId(id);
  };

  const confirmApprove = async (remarks?: string) => {
    if (!approveTargetId) return;
    try {
      if (role === "Manager") {
        await approvalApi.managerApprove(approveTargetId, remarks || undefined);
        toast.success("Request approved");
      } else if (role === "FinanceAdmin") {
        await approvalApi.financeApprove(approveTargetId, remarks || undefined);
        toast.success("Request approved");
      }
      setApproveTargetId(null);
      load();
    } catch {
      toast.error("Failed to approve request");
    }
  };

  const handleReject = async (id: string) => {
    setRejectTargetId(id);
  };

  const confirmReject = async (remarks?: string) => {
    if (!rejectTargetId) return;
    if (!remarks?.trim()) {
      toast.error("Rejection reason is required");
      return;
    }
    try {
      if (role === "Manager") {
        await approvalApi.managerReject(rejectTargetId, remarks.trim());
      } else if (role === "FinanceAdmin") {
        await approvalApi.financeReject(rejectTargetId, remarks.trim());
      }
      toast.success("Request rejected");
      setRejectTargetId(null);
      load();
    } catch {
      toast.error("Failed to reject request");
    }
  };

  const canCancel = (status?: string) =>
    status === "Draft" ||
    status === "PendingManagerApproval" ||
    status === "PendingFinanceReview";

  const canApprove = (status?: string) =>
    status === "PendingManagerApproval" || status === "PendingFinanceReview";

  const canEdit = (status?: string) =>
    role?.toLowerCase() === "requestor" && status === "Draft";

  const formatAmount = (amount?: number) =>
    amount ? `$${amount.toLocaleString()}` : "-";

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return "-";
    }
  };

  const getPageTitle = () => {
    const normalizedRole = role?.toLowerCase();
    switch (normalizedRole) {
      case "manager": return "Pending Approvals";
      case "financeadmin": return "Pending Review";
      case "systemadmin": return "All Requests";
      default: return "My Requests";
    }
  };

  if (loading) return <Loading />;
  if (error) return <EmptyState message={error} />;

  if (data.length === 0) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No requests found</h3>
          <p className="text-slate-500">{getPageTitle()} - No records to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{getPageTitle()}</h1>
          <p className="text-slate-500 mt-1">Manage and track all sponsorship requests</p>
        </div>
        {role?.toLowerCase() === "requestor" && (
          <button
            onClick={() => navigate("/create-request")}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Request
          </button>
        )}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-4 font-semibold text-slate-600 text-sm">Title</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600 text-sm">Department</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600 text-sm">Amount</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600 text-sm">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600 text-sm">Date</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/request/${r.id}`)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {r.title || "-"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{r.department || "-"}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{formatAmount(r.requestedAmount)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-500">{formatDate(r.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => navigate(`/request/${r.id}`)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        View
                      </button>
                      {role?.toLowerCase() === "requestor" && canEdit(r.status) && (
                        <button
                          onClick={() => navigate(`/request/${r.id}/edit`)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z" />
                          </svg>
                          Edit
                        </button>
                      )}
                      {role?.toLowerCase() === "requestor" && canCancel(r.status) && (
                        <button
                          onClick={() => handleCancel(r.id)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="M19 6l-1 14H6L5 6" />
                          </svg>
                          Cancel
                        </button>
                      )}
                      {(role?.toLowerCase() === "manager" || role?.toLowerCase() === "financeadmin") && canApprove(r.status) && (
                        <>
                          <button
                            onClick={() => handleApprove(r.id)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                          >
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="m20 6-11 11-5-5" />
                            </svg>
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(r.id)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                          >
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 6 6 18" />
                              <path d="m6 6 12 12" />
                            </svg>
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(cancelTargetId)}
        title="Cancel Request"
        message="Are you sure you want to cancel this request?"
        confirmLabel="Yes, Cancel"
        onCancel={() => setCancelTargetId(null)}
        onConfirm={confirmCancel}
        variant="warning"
      />
      <ConfirmDialog
        open={Boolean(approveTargetId)}
        title="Approve Request"
        message="Are you sure you want to approve this request?"
        confirmLabel="Approve"
        onCancel={() => setApproveTargetId(null)}
        onConfirm={confirmApprove}
        variant="info"
        remarksLabel="Approval Remarks (Optional)"
        remarksPlaceholder="Add any optional note for the requester."
      />
      <ConfirmDialog
        open={Boolean(rejectTargetId)}
        title="Reject Request"
        message="Are you sure you want to reject this request?"
        confirmLabel="Reject"
        onCancel={() => setRejectTargetId(null)}
        onConfirm={confirmReject}
        variant="danger"
        remarksLabel="Rejection Reason"
        remarksPlaceholder="Explain why this request is being rejected."
        remarksRequired
      />
    </div>
  );
}
