import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../../../shared/components/Sidebar.jsx";
import AllAttendancePage from "../../attendance/pages/AllAttendancePage.jsx";
import ReportPage from "../../attendance/pages/ReportPage.jsx";
import PendingOvertimePage from "../../overtime/pages/PendingOvertimePage.jsx";
import { useAttendance } from "../../attendance/hook/useAttendance.js";
import { useOvertime } from "../../overtime/hook/useOvertime.js";
import { useUser } from "../hook/useUser.js";
import {
  Users, CalendarDays, Timer, CheckCircle2,
  XCircle, AlertCircle, ArrowRight, Shield,
  FileText, Search, TrendingUp,
} from "lucide-react";

/* ── colours — same as Employee & Manager ── */
const C = {
  bg:     "var(--color-bg-main)",
  card:   "var(--color-bg-card)",
  inner:  "var(--color-bg-inner)",
  border: "var(--color-border-subtle)",
  orange: "var(--color-accent-primary)",
  indigo: "var(--color-accent-secondary)",
  green:  "var(--color-accent-success)",
  yellow: "var(--color-accent-warning)",
  red:    "var(--color-accent-danger)",
  t1:     "var(--color-text-primary)",
  t2:     "var(--color-text-secondary)",
  tm:     "var(--color-text-muted)",
};

/* ── Stat card — same as Employee & Manager ── */
const StatCard = ({ label, value, sub, subColor, Icon, iconBg }) => (
  <div
    className="metric-card"
    style={{ flex: 1, display: "flex", alignItems: "flex-start", gap: 16 }}
  >
    <div style={{
      width: 44, height: 44, borderRadius: 11, flexShrink: 0,
      background: iconBg, display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Icon size={20} color={subColor || C.orange} />
    </div>
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, color: C.t2, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
        {label}
      </p>
      <p style={{ fontSize: 26, fontWeight: 700, color: C.t1, lineHeight: 1, letterSpacing: "-0.5px" }}>
        {value}
      </p>
      {sub && (
        <p style={{ fontSize: 11, fontWeight: 500, color: subColor || C.t2, marginTop: 5 }}>
          {sub}
        </p>
      )}
    </div>
  </div>
);

/* ── AdminHome ── */
const AdminHome = ({ setActivePage }) => {
  const { allRecords }       = useSelector((s) => s.attendance);
  const { pendingOvertimes } = useSelector((s) => s.overtime);
  const { users }            = useSelector((s) => s.user);
  const { user }             = useSelector((s) => s.auth);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  const todayStr          = new Date().toISOString().split("T")[0];
  const todayRecords      = allRecords.filter((r) => r.date === todayStr);
  const presentToday      = todayRecords.filter((r) => r.punchIn?.time).length;
  const invalidRecords    = allRecords.filter((r) => r.validationStatus === "invalid").length;
  const pendingValidation = allRecords.filter((r) => r.validationStatus === "pending" && r.punchIn?.time).length;
  const totalEmployees    = users.filter((u) => u.role === "employee").length;
  const totalManagers     = users.filter((u) => u.role === "manager").length;

  const GAP = 16;
  const PAD = 28;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg }}>

      {/* ── TOP BAR ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: `20px ${PAD}px`,
        borderBottom: `1px solid ${C.border}`,
        background: C.bg,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(249,115,22,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={14} color={C.orange} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: C.t1, letterSpacing: "-0.3px" }}>
              Admin Control Center
            </h2>
          </div>
          <p style={{ fontSize: 13, color: C.t2, marginLeft: 38 }}>{today}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "9px 16px", borderRadius: 999,
            background: C.card, border: `1px solid ${C.border}`,
          }}>
            <Search size={14} color={C.t2} />
            <input
              type="text" placeholder="Search..."
              style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, color: C.t2, width: 160 }}
            />
          </div>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: C.orange, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, color: "#fff",
            boxShadow: "0 0 0 3px rgba(249,115,22,0.15)",
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex: 1, display: "flex", gap: GAP, padding: PAD }}>

        {/* ── LEFT (main) ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: GAP, minWidth: 0 }}>

          {/* Stat cards row */}
          <div style={{ display: "flex", gap: GAP }}>
            <StatCard
              label="Total Users" value={users.length}
              sub={`${totalEmployees} employees · ${totalManagers} managers`}
              Icon={Users} subColor={C.orange}
              iconBg="rgba(249,115,22,0.12)"
            />
            <StatCard
              label="Present Today" value={presentToday}
              sub="↑ active attendance today"
              Icon={TrendingUp} subColor={C.green}
              iconBg="rgba(34,197,94,0.12)"
            />
            <StatCard
              label="Pending Overtime" value={pendingOvertimes.length}
              sub={pendingOvertimes.length > 0 ? "Needs review" : "All clear"}
              Icon={Timer} subColor={C.yellow}
              iconBg="rgba(245,158,11,0.12)"
            />
            <StatCard
              label="Invalid Records" value={invalidRecords}
              sub={invalidRecords > 0 ? "Flagged for review" : "No issues"}
              Icon={XCircle} subColor={C.red}
              iconBg="rgba(239,68,68,0.12)"
            />
          </div>

          {/* Middle row: User breakdown + Today's summary */}
          <div style={{ display: "flex", gap: GAP }}>

            {/* User Breakdown */}
            <div className="metric-card" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>User Breakdown</p>
                  <p style={{ fontSize: 12, color: C.t2, marginTop: 3 }}>Roles distribution across the system</p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
                {[
                  { label: "Employees", count: totalEmployees, color: C.orange },
                  { label: "Managers",  count: totalManagers,  color: C.green  },
                  { label: "Admins",    count: users.filter((u) => u.role === "admin").length, color: C.yellow },
                ].map((item) => (
                  <div key={item.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <p style={{ fontSize: 13, color: C.t2, fontWeight: 500 }}>{item.label}</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>{item.count}</p>
                    </div>
                    <div style={{ height: 6, borderRadius: 99, background: C.inner, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 99,
                        width: `${Math.max((item.count / (users.length || 1)) * 100, 2)}%`,
                        background: item.color, transition: "width 0.8s ease",
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActivePage("users")}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  marginTop: 20, padding: "10px 0", borderRadius: 10,
                  border: `1px solid ${C.border}`, background: C.inner,
                  fontSize: 12, fontWeight: 600, color: C.t1, cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#1e1e1e"}
                onMouseLeave={e => e.currentTarget.style.background = C.inner}
              >
                View All Users <ArrowRight size={13} />
              </button>
            </div>

            {/* Today's Attendance Summary */}
            <div className="metric-card" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>Today's Summary</p>
                  <p style={{ fontSize: 12, color: C.t2, marginTop: 3 }}>Live attendance across all employees</p>
                </div>
                <button
                  onClick={() => setActivePage("attendance")}
                  style={{ fontSize: 12, fontWeight: 600, color: C.orange, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                >
                  View All <ArrowRight size={12} />
                </button>
              </div>

              <div style={{ overflowY: "auto", flex: 1 }}>
                {todayRecords.length === 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 40, opacity: 0.6 }}>
                    <AlertCircle size={32} color={C.tm} style={{ marginBottom: 12 }} />
                    <p style={{ fontSize: 13, color: C.t2, fontWeight: 500 }}>No records for today yet</p>
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      {todayRecords.slice(0, 6).map((r) => (
                        <tr key={r._id} style={{ borderBottom: `1px solid ${C.border}` }}>
                          <td style={{ padding: "11px 0" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{
                                width: 30, height: 30, borderRadius: "50%",
                                background: C.inner, border: `1px solid ${C.border}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 11, fontWeight: 700, color: C.t1, flexShrink: 0,
                              }}>
                                {(r.userId?.name || "?")[0].toUpperCase()}
                              </div>
                              <p style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{r.userId?.name || "Unknown"}</p>
                            </div>
                          </td>
                          <td style={{ padding: "11px 0", textAlign: "right" }}>
                            <span style={{
                              fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 5,
                              background: r.status === "completed" ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
                              color: r.status === "completed" ? C.green : C.yellow,
                              textTransform: "uppercase", letterSpacing: "0.05em",
                            }}>
                              {r.status === "completed" ? "Done" : "Active"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="metric-card" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: C.t1, marginBottom: 20 }}>Quick Actions</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Review Pending Overtime", sub: `${pendingOvertimes.length} awaiting`, page: "overtime", Icon: Timer,       color: C.yellow, bg: "rgba(245,158,11,0.12)"  },
                  { label: "Validate Attendance",     sub: `${pendingValidation} pending`,         page: "attendance", Icon: CheckCircle2, color: C.green,  bg: "rgba(34,197,94,0.12)"   },
                  { label: "Generate Report",          sub: "Daily attendance report",              page: "report",     Icon: FileText,     color: C.orange, bg: "rgba(249,115,22,0.12)"  },
                ].map((action) => (
                  <button
                    key={action.label}
                    onClick={() => setActivePage(action.page)}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 16px", borderRadius: 10, textAlign: "left",
                      border: `1px solid ${C.border}`, background: C.inner,
                      cursor: "pointer", transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#1a1a1a"}
                    onMouseLeave={e => e.currentTarget.style.background = C.inner}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: action.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <action.Icon size={17} color={action.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{action.label}</p>
                      <p style={{ fontSize: 10, fontWeight: 600, color: C.t2, textTransform: "uppercase", letterSpacing: "0.07em", marginTop: 3 }}>{action.sub}</p>
                    </div>
                    <ArrowRight size={14} color={C.tm} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Users Table */}
          {users.length > 0 && (
            <div className="metric-card" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>Recent Users</p>
                <button
                  onClick={() => setActivePage("users")}
                  style={{ fontSize: 12, fontWeight: 600, color: C.orange, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                >
                  View All <ArrowRight size={12} />
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                      {["NAME", "EMAIL", "ROLE", "DEPARTMENT"].map((h, i) => (
                        <th key={h} style={{
                          paddingBottom: 10, fontSize: 10, fontWeight: 700,
                          color: C.tm, letterSpacing: "0.08em",
                          textAlign: i === 3 ? "right" : i === 2 ? "center" : "left",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 5).map((u) => (
                      <tr key={u._id} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: "12px 0", fontSize: 13, fontWeight: 600, color: C.t1 }}>{u.name}</td>
                        <td style={{ padding: "12px 0", fontSize: 13, color: C.t2 }}>{u.email}</td>
                        <td style={{ padding: "12px 0", textAlign: "center" }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 5,
                            textTransform: "capitalize",
                            background: u.role === "admin"   ? "rgba(245,158,11,0.1)"
                                       : u.role === "manager" ? "rgba(34,197,94,0.1)"
                                       : "rgba(255,255,255,0.05)",
                            color:      u.role === "admin"   ? C.yellow
                                       : u.role === "manager" ? C.green
                                       : C.t2,
                            border: `1px solid ${
                              u.role === "admin"   ? "rgba(245,158,11,0.2)"
                            : u.role === "manager" ? "rgba(34,197,94,0.2)"
                            : "rgba(255,255,255,0.08)"}`,
                          }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: "12px 0", fontSize: 13, color: C.t2, textAlign: "right" }}>{u.department || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── All Users Page ── */
const AllUsersPage = () => {
  const { users, loading } = useSelector((s) => s.user);
  const [search, setSearch]       = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = users.filter((u) => {
    const nameMatch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const roleMatch = roleFilter === "all" || u.role === roleFilter;
    return nameMatch && roleMatch;
  });

  if (loading && users.length === 0) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg }}>
        <p style={{ fontSize: 13, color: C.t2, fontWeight: 500 }}>Loading users...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: 28, background: C.bg }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: C.t1, letterSpacing: "-0.3px", marginBottom: 6 }}>All Users</h2>
        <p style={{ fontSize: 13, color: C.t2 }}>Manage and monitor all registered users in the system</p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 16px", borderRadius: 10, flex: 1,
          background: C.card, border: `1px solid ${C.border}`,
        }}>
          <Search size={14} color={C.t2} />
          <input
            type="text" placeholder="Search by name or email..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, color: C.t1, width: "100%" }}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "employee", "manager", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              style={{
                padding: "10px 18px", borderRadius: 10, fontSize: 12, fontWeight: 700,
                textTransform: "capitalize", cursor: "pointer", transition: "all 0.15s",
                background: roleFilter === r ? C.orange : C.card,
                border: `1px solid ${roleFilter === r ? C.orange : C.border}`,
                color: roleFilter === r ? "#fff" : C.t2,
                boxShadow: roleFilter === r ? "0 4px 14px rgba(249,115,22,0.25)" : "none",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="metric-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 240 }}>
          <AlertCircle size={40} color={C.tm} style={{ marginBottom: 14 }} />
          <p style={{ fontSize: 14, color: C.t2, fontWeight: 500 }}>No users found matching your criteria</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {filtered.map((u) => (
            <div
              key={u._id}
              className="metric-card"
              style={{ transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: "50%",
                  background: C.orange, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, fontWeight: 700, color: "#fff",
                  boxShadow: "0 0 0 4px rgba(249,115,22,0.12)",
                }}>
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 5,
                  textTransform: "capitalize",
                  background: u.role === "admin"   ? "rgba(245,158,11,0.1)"
                             : u.role === "manager" ? "rgba(34,197,94,0.1)"
                             : "rgba(255,255,255,0.05)",
                  color:      u.role === "admin"   ? C.yellow
                             : u.role === "manager" ? C.green
                             : C.t2,
                  border: `1px solid ${
                    u.role === "admin"   ? "rgba(245,158,11,0.2)"
                  : u.role === "manager" ? "rgba(34,197,94,0.2)"
                  : "rgba(255,255,255,0.08)"}`,
                }}>
                  {u.role}
                </span>
              </div>

              <p style={{ fontSize: 16, fontWeight: 700, color: C.t1, marginBottom: 4 }}>{u.name}</p>
              <p style={{ fontSize: 13, color: C.t2, marginBottom: 16 }}>{u.email}</p>

              <div style={{ paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.tm, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>
                  Department
                </p>
                <p style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{u.department || "Unassigned"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Shell ── */
const AdminDashboard = () => {
  const [activePage, setActivePage]       = useState("dashboard");
  const { handleGetAllAttendance }        = useAttendance();
  const { handleGetPendingOvertimes }     = useOvertime();
  const { handleGetAllUsers }             = useUser();

  useEffect(() => {
    handleGetAllAttendance();
    handleGetPendingOvertimes();
    handleGetAllUsers();
  }, []);

  const render = () => {
    switch (activePage) {
      case "dashboard":  return <AdminHome setActivePage={setActivePage} />;
      case "attendance": return <AllAttendancePage />;
      case "users":      return <AllUsersPage />;
      case "overtime":   return <PendingOvertimePage />;
      case "report":     return <ReportPage />;
      default:           return <AdminHome setActivePage={setActivePage} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--color-bg-main)" }}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main style={{ flex: 1, overflowY: "auto" }}>{render()}</main>
    </div>
  );
};

export default AdminDashboard;