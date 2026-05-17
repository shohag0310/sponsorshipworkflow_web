import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { requestApi } from "../api/requestApi";
import { approvalApi } from "../../approvals/api/approvalApi";
import { useAuth } from "../../../auth/AuthContext";
import type { Request } from "../types/request";
import StatusBadge from "../../../components/ui/StatusBadge";
import Loading from "../../../components/ui/Loading";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import { toast } from "react-hot-toast/headless";

interface HistoryItem {
  id: string;
  action: string;
  actionBy: string;
  remarks?: string;
  createdAt: string;
}

export default function RequestDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role } = useAuth();
  const [request, setRequest] = useState<Request | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      loadRequest();
      loadHistory();
    }
  }, [id]);

  const loadRequest = async () => {
    try {
      const data = await requestApi.getById(id!);
      setRequest(data);
    } catch {
      toast.error("Failed to load request details");
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const data = await requestApi.getHistory(id!);
      setHistory(data || []);
    } catch {
      toast.error("Failed to load request history");
    }
  };

  const canApprove = () => {
    const normalizedRole = role?.toLowerCase();
    if (!request) return false;
    if (normalizedRole === "manager" && request.status === "PendingManagerApproval") return true;
    if (normalizedRole === "financeadmin" && request.status === "PendingFinanceReview") return true;
    return false;
  };

  const handleApprove = async () => {
    setShowApproveConfirm(true);
  };

  const confirmApprove = async (remarks?: string) => {
    try {
      if (role === "Manager") {
        await approvalApi.managerApprove(id!, remarks || undefined);
      } else if (role === "FinanceAdmin") {
        await approvalApi.financeApprove(id!, remarks || undefined);
      }
      toast.success("Request approved");
      setShowApproveConfirm(false);
      loadRequest();
      loadHistory();
    } catch {
      toast.error("Failed to approve request");
    }
  };

  const handleReject = async () => {
    setShowRejectConfirm(true);
  };

  const confirmReject = async (remarks?: string) => {
    if (!remarks?.trim()) {
      toast.error("Rejection reason is required");
      return;
    }
    try {
      if (role === "Manager") {
        await approvalApi.managerReject(id!, remarks.trim());
      } else if (role === "FinanceAdmin") {
        await approvalApi.financeReject(id!, remarks.trim());
      }
      toast.success("Request rejected");
      setShowRejectConfirm(false);
      loadRequest();
      loadHistory();
    } catch {
      toast.error("Failed to reject request");
    }
  };

  const canSubmit = () => {
    return role?.toLowerCase() === "requestor" && request?.status === "Draft";
  };

  const handleSubmit = async () => {
    setShowSubmitConfirm(true);
  };

  const confirmSubmit = async () => {
    try {
      await requestApi.submit(id!);
      toast.success("Request submitted successfully");
      setShowSubmitConfirm(false);
      loadRequest();
      loadHistory();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to submit request");
    }
  };

  if (loading) return <Loading />;

  if (!request) {
    return <div className="p-4">Request not found</div>;
  }

  const formatCurrency = (amount?: number) => {
    return amount ? `$${amount.toLocaleString()}` : "-";
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "-";
    }
  };

  const InfoItem = ({ label, value }: { label: string; value: string | number | undefined }) => (
    <div>
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className="text-sm text-slate-800">{value ?? "-"}</div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-transparent border-none cursor-pointer text-slate-500 hover:text-slate-700 flex items-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-slate-800 m-0">Request Details</h1>
          <StatusBadge status={request.status} />
        </div>
        {canSubmit() && (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Submit for Approval
          </button>
        )}
        {canApprove() && (
          <div className="flex gap-2">
            <button
              onClick={handleApprove}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              Approve
            </button>
            <button
              onClick={handleReject}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Request Information */}
        <div className="glass-card p-6">
          <h2 className="text-base font-semibold mb-4">Request Information</h2>
          <div className="space-y-4">
            <InfoItem label="Title" value={request.title} />
            <InfoItem label="Department" value={request.department} />
            <InfoItem label="Event Name" value={request.eventName} />
            <InfoItem label="Event Date" value={formatDate(request.eventDate)} />
            <InfoItem label="Requested Amount" value={formatCurrency(request.requestedAmount)} />
            <InfoItem label="Sponsorship Type" value={request.sponsorshipType} />
          </div>
        </div>

        {/* Purpose & Benefits */}
        <div className="glass-card p-6">
          <h2 className="text-base font-semibold mb-4">Purpose & Benefits</h2>
          <div className="space-y-4">
            <InfoItem label="Purpose" value={request.purpose} />
            <InfoItem label="Expected Business Benefit" value={request.expectedBusinessBenefit} />
          </div>
        </div>

        {/* Timeline */}
        <div className="glass-card p-6 md:col-span-2">
          <h2 className="text-base font-semibold mb-4">Timeline</h2>
          {history.length === 0 ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Created on {formatDate(request.createdAt)}</span>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item, index) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${item.action === 'Created' ? 'bg-green-500' : item.action.includes('Approved') ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                    {index < history.length - 1 && <div className="w-0.5 h-full bg-slate-200 mt-1"></div>}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-800">
                      {item.action}
                      {item.actionBy && <span className="font-normal text-slate-600"> by {item.actionBy}</span>}
                    </div>
                    {item.remarks && <div className="text-sm text-slate-500 mt-1">"{item.remarks}"</div>}
                    <div className="text-xs text-slate-400 mt-1">{formatDate(item.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showSubmitConfirm}
        title="Submit Request"
        message="Are you sure you want to submit this request? Once submitted, you won't be able to edit it."
        confirmLabel="Submit"
        onCancel={() => setShowSubmitConfirm(false)}
        onConfirm={confirmSubmit}
        variant="info"
      />
      <ConfirmDialog
        open={showApproveConfirm}
        title="Approve Request"
        message="Are you sure you want to approve this request?"
        confirmLabel="Approve"
        onCancel={() => setShowApproveConfirm(false)}
        onConfirm={confirmApprove}
        variant="info"
        remarksLabel="Approval Remarks (Optional)"
        remarksPlaceholder="Add any optional note for this approval."
      />
      <ConfirmDialog
        open={showRejectConfirm}
        title="Reject Request"
        message="Are you sure you want to reject this request?"
        confirmLabel="Reject"
        onCancel={() => setShowRejectConfirm(false)}
        onConfirm={confirmReject}
        variant="danger"
        remarksLabel="Rejection Reason"
        remarksPlaceholder="Write a clear rejection reason."
        remarksRequired
      />
    </div>
  );
}
