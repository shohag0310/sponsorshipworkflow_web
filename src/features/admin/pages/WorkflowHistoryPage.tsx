import { useState, useEffect } from "react";
import Loading from "../../../components/ui/Loading";
import EmptyState from "../../../components/ui/EmptyState";
import { requestApi } from "../../requests/api/requestApi";
import { toast } from "react-hot-toast/headless";

interface WorkflowHistory {
  id: string;
  requestId: string;
  request?: { title: string };
  action: string;
  actionByUserId?: string;
  actionByUser?: { email: string };
  remarks?: string;
  createdAt: string;
}

const ActionBadge = ({ action }: { action: string }) => {
  const getColors = () => {
    if (action === "Approved") return "bg-green-100 text-green-700";
    if (action === "Rejected") return "bg-red-100 text-red-700";
    return "bg-blue-100 text-blue-700";
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${getColors()}`}>
      {action}
    </span>
  );
};

export default function WorkflowHistoryPage() {
  const [history, setHistory] = useState<WorkflowHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await requestApi.getAllHistory();
      setHistory(data || []);
    } catch {
      toast.error("Failed to load workflow history");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return "-";
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Workflow History</h1>

      {history.length === 0 ? (
        <EmptyState message="No workflow history found" />
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left p-4 font-semibold text-slate-600">Request ID</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Title</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Action</th>
                  <th className="text-left p-4 font-semibold text-slate-600">User</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Remarks</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Date</th>
                </tr>
              </thead>

              <tbody>
                {history.map((h) => (
                  <tr key={h.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4 font-medium text-slate-800">{h.requestId}</td>
                    <td className="p-4 text-slate-600">{h.request?.title || "-"}</td>
                    <td className="p-4">
                      <ActionBadge action={h.action} />
                    </td>
                    <td className="p-4 text-slate-600">{h.actionByUser?.email || "-"}</td>
                    <td className="p-4 text-slate-500">{h.remarks || "-"}</td>
                    <td className="p-4 text-slate-500">{formatDate(h.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
