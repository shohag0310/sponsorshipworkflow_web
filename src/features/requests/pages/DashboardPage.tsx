import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestApi } from "../api/requestApi";
import { useAuth } from "../../../auth/AuthContext";
import Loading from "../../../components/ui/Loading";
import { toast } from "react-hot-toast/headless";

interface DashboardStats {
  totalRequests: number;
  pending: number;
  approved: number;
  rejected: number;
}

const StatCard = ({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) => {
  const colorClasses: Record<string, string> = {
    blue: "from-blue-50 to-blue-100/50 border-blue-200 text-blue-600",
    yellow: "from-amber-50 to-amber-100/50 border-amber-200 text-amber-600",
    green: "from-emerald-50 to-emerald-100/50 border-emerald-200 text-emerald-600",
    red: "from-red-50 to-red-100/50 border-red-200 text-red-600",
  };
  const bgClass = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`p-6 rounded-xl border bg-gradient-to-br ${bgClass}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium opacity-70">{label}</div>
          <div className="text-3xl font-bold mt-1">{value}</div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
};

const QuickActionButton = ({ icon, label, to, color }: { icon: React.ReactNode; label: string; to: string; color: string }) => {
  const navigate = useNavigate();
  const colorClasses: Record<string, string> = {
    blue: "hover:bg-blue-50 hover:text-blue-600",
    green: "hover:bg-emerald-50 hover:text-emerald-600",
    purple: "hover:bg-violet-50 hover:text-violet-600",
    orange: "hover:bg-orange-50 hover:text-orange-600",
  };

  return (
    <button
      onClick={() => navigate(to)}
      className={`flex items-center gap-3 p-4 rounded-xl border border-slate-200 text-slate-600 transition-all hover:shadow-md ${colorClasses[color] || colorClasses.blue}`}
    >
      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default function DashboardPage() {
  const { role } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, [role]);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await requestApi.getDashboardStats();
      setStats(data);
    } catch {
      setError("Failed to load dashboard stats");
      toast.error("Failed to load dashboard stats");
      setStats({ totalRequests: 0, pending: 0, approved: 0, rejected: 0 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const getCardIcon = (color: string) => {
    switch (color) {
      case "blue":
        return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
      case "yellow":
        return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case "green":
        return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case "red":
        return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      default:
        return null;
    }
  };

  const cards = [
    { label: "Total Requests", value: stats.totalRequests, color: "blue" },
    { label: "Pending Approval", value: stats.pending, color: "yellow" },
    { label: "Approved", value: stats.approved, color: "green" },
    { label: "Rejected", value: stats.rejected, color: "red" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="mt-1 text-slate-500">Welcome back! Here&apos;s an overview of your sponsorship requests.</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} color={card.color} icon={getCardIcon(card.color)} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {role?.toLowerCase() === "requestor" && (
            <>
              <QuickActionButton
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}
                label="Create Request"
                to="/create-request"
                color="blue"
              />
              <QuickActionButton
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                label="My Requests"
                to="/my-requests"
                color="purple"
              />
            </>
          )}
          {role?.toLowerCase() === "manager" && (
            <QuickActionButton
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              label="Pending Approvals"
              to="/pending-approvals"
              color="orange"
            />
          )}
          {role?.toLowerCase() === "financeadmin" && (
            <QuickActionButton
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
              label="Pending Review"
              to="/pending-review"
              color="green"
            />
          )}
          {role?.toLowerCase() === "systemadmin" && (
            <>
              <QuickActionButton
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /></svg>}
                label="All Requests"
                to="/all-requests"
                color="blue"
              />
              <QuickActionButton
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                label="Sponsorship Types"
                to="/sponsorship-types"
                color="purple"
              />
            </>
          )}
        </div>
      </div>

      {/* User Info Card */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Welcome, {role || "User"}!</h3>
            <p className="text-slate-300 text-sm">Logged in as {role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
