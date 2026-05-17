import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { menuConfig } from "./menu";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { role } = useAuth();
  const normalizedRole = role?.trim().toLowerCase() || "";

  const filteredMenu = normalizedRole
    ? menuConfig.filter((item) => item.roles.some((r) => r.toLowerCase() === normalizedRole))
    : menuConfig.filter((item) => item.roles.length === 4);

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-[var(--shell-sidebar)] border-r border-white/40 bg-slate-950/95 p-5 text-white shadow-2xl backdrop-blur-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-7 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">SponsorFlow</h2>
            <p className="text-xs text-slate-300">Sponsorship Operations</p>
          </div>
          <button
            type="button"
            onClick={onToggle}
            className="rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-xs lg:hidden"
          >
            Close
          </button>
        </div>

        <div className="mb-5 rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-300">Signed in as</p>
          <p className="mt-1 text-sm font-medium">{role || "User"}</p>
        </div>

        <nav className="space-y-1">
          {filteredMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => window.innerWidth < 1024 && onToggle()}
              className={({ isActive }) =>
                `block rounded-xl px-3 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-gradient-to-r from-teal-500/25 to-sky-500/25 font-semibold text-white ring-1 ring-teal-400/35"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6 text-xs text-slate-400">Sponsorship Workflow v1.0</div>
      </aside>
    </>
  );
}
