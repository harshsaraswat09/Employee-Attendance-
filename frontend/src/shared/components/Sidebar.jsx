import { useSelector } from "react-redux";
import { useAuth } from "../../features/auth/hook/useAuth.js";
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  Timer,
  LogOut,
  Settings,
  HelpCircle,
  Layers,
  Users,
  FileText,
} from "lucide-react";

const Sidebar = ({ activePage, setActivePage }) => {
  const { user } = useSelector((state) => state.auth);
  const { handleLogout } = useAuth();

  const employeeLinks = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { key: "punch", label: "Attendance", icon: <Clock size={18} /> },
    { key: "attendance", label: "My History", icon: <CalendarDays size={18} /> },
    { key: "overtime", label: "Overtime", icon: <Timer size={18} /> },
    { key: "report", label: "My Report", icon: <FileText size={18} /> },
  ];

  const managerLinks = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { key: "team", label: "Team Attendance", icon: <CalendarDays size={18} /> },
    { key: "overtime", label: "Pending Overtime", icon: <Timer size={18} /> },
    { key: "report", label: "Team Report", icon: <FileText size={18} /> },
  ];

  const adminLinks = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { key: "attendance", label: "All Attendance", icon: <CalendarDays size={18} /> },
    { key: "users", label: "All Users", icon: <Users size={18} /> },
    { key: "overtime", label: "Pending Overtime", icon: <Timer size={18} /> },
    { key: "report", label: "Reports", icon: <FileText size={18} /> },
  ];

  const links =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "manager"
      ? managerLinks
      : employeeLinks;

  return (
    <aside className="w-64 min-h-screen flex flex-col bg-[var(--color-bg-main)] border-r border-[var(--color-border-subtle)]">
      {/* Brand */}
      <div className="flex items-center gap-3 px-8 py-8 mb-4">
        <div className="w-8 h-8 rounded flex items-center justify-center bg-[var(--color-accent-primary)] bg-opacity-20">
          <Layers size={18} className="text-[var(--color-accent-primary)]" strokeWidth={2.5} />
        </div>
        <span className="text-lg font-bold text-white tracking-wide">Aether Flow</span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 space-y-1">
        {links.map((link) => {
          const isActive = activePage === link.key;
          return (
            <button
              key={link.key}
              onClick={() => setActivePage(link.key)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-[var(--color-bg-card)] text-[var(--color-accent-primary)]"
                  : "text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-card-hover)]"
              }`}
            >
              {link.icon}
              {link.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom Nav / User Settings */}
      <div className="px-4 pb-8 space-y-1">
        <button
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-card-hover)] transition-all"
        >
          <Settings size={18} />
          Settings
        </button>
        <button
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-card-hover)] transition-all mb-4"
        >
          <HelpCircle size={18} />
          Help Center
        </button>

        <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
           <button
             onClick={handleLogout}
             className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-card-hover)] transition-all"
           >
             <LogOut size={18} />
             Sign Out
           </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;