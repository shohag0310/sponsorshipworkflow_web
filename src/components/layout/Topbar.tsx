import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

interface TopbarProps {
  onMenuToggle: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 px-4 py-3 backdrop-blur md:px-7">
      <div className="mx-auto flex max-w-[120rem] items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-slate-600 shadow-sm transition hover:text-slate-900 lg:hidden"
          >
            Menu
          </button>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Workspace</p>
            <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown((v) => !v)}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-sky-500 text-sm font-semibold text-white">
              {userInitial}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block max-w-[15rem] truncate text-sm font-medium text-slate-900">
                {user?.email || "User"}
              </span>
              <span className="block text-xs text-slate-500">{role || "Role"}</span>
            </span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
