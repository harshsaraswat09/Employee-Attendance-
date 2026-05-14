import { useSelector } from "react-redux";
import { useAuth } from "../../features/auth/hook/useAuth.js";
import {
  LayoutDashboard, Clock, CalendarDays, Timer,
  LogOut, Layers, Users, FileText,
} from "lucide-react";

const Sidebar = ({ activePage, setActivePage }) => {
  const { user }       = useSelector((state) => state.auth);
  const { handleLogout } = useAuth();

  const employeeLinks = [
    { key: "dashboard",  label: "Dashboard",  icon: LayoutDashboard },
    { key: "punch",      label: "Attendance", icon: Clock },
    { key: "attendance", label: "My History", icon: CalendarDays },
    { key: "overtime",   label: "Overtime",   icon: Timer },
    { key: "report",     label: "My Report",  icon: FileText },
  ];

  const managerLinks = [
    { key: "dashboard",  label: "Dashboard",        icon: LayoutDashboard },
    { key: "team",       label: "Team Attendance",  icon: CalendarDays },
    { key: "overtime",   label: "Pending Overtime", icon: Timer },
    { key: "report",     label: "Team Report",      icon: FileText },
  ];

  const adminLinks = [
    { key: "dashboard",  label: "Dashboard",        icon: LayoutDashboard },
    { key: "attendance", label: "All Attendance",   icon: CalendarDays },
    { key: "users",      label: "All Users",        icon: Users },
    { key: "overtime",   label: "Pending Overtime", icon: Timer },
    { key: "report",     label: "Reports",          icon: FileText },
  ];

  const links =
    user?.role === "admin"   ? adminLinks :
    user?.role === "manager" ? managerLinks :
    employeeLinks;

  return (
    <aside
      className="flex flex-col"
      style={{
        width: 220,
        minHeight: "100vh",
        background: "var(--color-bg-sidebar)",
        borderRight: "1px solid var(--color-border-subtle)",
        /* Metric Flow: sidebar feels separate from content */
      }}
    >
      {/* ── Brand ── */}
      <div style={{ padding: "28px 20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: "var(--color-accent-primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(249,115,22,0.35)",
          }}>
            <Layers size={17} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: "-0.2px" }}>
            Aether Flow
          </span>
        </div>
      </div>

      {/* ── Nav ── */}
      {/* Section label like Metric Flow */}
      <div style={{ padding: "0 16px 8px" }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: "var(--color-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Main Menu
        </span>
      </div>

      <nav style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {links.map(({ key, label, icon: Icon }) => {
          const active = activePage === key;
          return (
            <button
              key={key}
              onClick={() => setActivePage(key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                padding: "10px 12px",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                fontSize: 13.5,
                fontWeight: active ? 600 : 500,
                letterSpacing: "-0.1px",
                width: "100%",
                textAlign: "left",
                transition: "all 0.15s",
                background: active ? "var(--color-accent-primary)" : "transparent",
                color: active ? "#fff" : "var(--color-text-secondary)",
                boxShadow: active ? "0 3px 10px rgba(249,115,22,0.25)" : "none",
              }}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 2} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* ── Preference section label ── */}
      <div style={{ padding: "16px 16px 8px" }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: "var(--color-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Preference
        </span>
      </div>

      {/* ── Bottom ── */}
      <div style={{ padding: "0 10px 24px", display: "flex", flexDirection: "column", gap: 2 }}>
        {/* User card */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 12px", marginBottom: 4,
          borderRadius: 9,
          background: "var(--color-bg-inner)",
          border: "1px solid var(--color-border-subtle)",
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "var(--color-accent-primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0,
          }}>
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.name || "User"}
            </p>
            <p style={{ fontSize: 10, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
              {user?.role || "Role"}
            </p>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: 11,
            padding: "10px 12px", borderRadius: 9,
            border: "none", cursor: "pointer",
            fontSize: 13.5, fontWeight: 500, width: "100%", textAlign: "left",
            background: "transparent",
            color: "var(--color-accent-danger)",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;