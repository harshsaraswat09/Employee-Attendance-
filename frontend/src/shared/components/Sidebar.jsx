import { useSelector } from "react-redux";
import { useAuth } from "../../features/auth/hook/useAuth.js";
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  Timer,
  LogOut,
  Asterisk,
  Users,
} from "lucide-react";

const Sidebar = ({ activePage, setActivePage }) => {
  const { user } = useSelector((state) => state.auth);
  const { handleLogout } = useAuth();

  const employeeLinks = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { key: "punch", label: "Attendance", icon: <Clock size={18} /> },
    { key: "attendance", label: "My History", icon: <CalendarDays size={18} /> },
    { key: "overtime", label: "Overtime", icon: <Timer size={18} /> },
  ];

  const managerLinks = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { key: "team", label: "Team Attendance", icon: <CalendarDays size={18} /> },
    { key: "overtime", label: "Pending Overtime", icon: <Timer size={18} /> },
  ];

  const adminLinks = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { key: "all", label: "All Attendance", icon: <CalendarDays size={18} /> },
    { key: "users", label: "All Users", icon: <Users size={18} /> },
    { key: "overtime", label: "Pending Overtime", icon: <Timer size={18} /> },
  ];

  const links =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "manager"
      ? managerLinks
      : employeeLinks;

  return (
    <aside className="w-56 min-h-screen flex flex-col"
      style={{ backgroundColor: "#111111", borderRight: "1px solid #1f1f1f" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "#c8f135" }}
        >
          <Asterisk size={18} className="text-black" strokeWidth={3} />
        </div>
        <span className="text-base font-bold text-white">Aether</span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {links.map((link) => (
          <button
            key={link.key}
            onClick={() => setActivePage(link.key)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              backgroundColor: activePage === link.key ? "#c8f135" : "transparent",
              color: activePage === link.key ? "#000000" : "#888888",
            }}
          >
            {link.icon}
            {link.label}
          </button>
        ))}
      </nav>

      {/* User Card */}
      <div className="px-3 py-4">
        <div className="rounded-2xl p-4"
          style={{ backgroundColor: "#1a1a1a" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#2a2a2a" }}
            >
              <span className="text-white font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user?.name}</p>
              <p className="text-xs capitalize" style={{ color: "#888888" }}>
                {user?.role} Profile
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-sm font-medium transition"
            style={{ color: "#888888" }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;