import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../../../shared/components/Sidebar.jsx";
import TeamAttendancePage from "../../attendance/pages/TeamAttendancePage.jsx";
import ReportPage from "../../attendance/pages/ReportPage.jsx";
import PendingOvertimePage from "../../overtime/pages/PendingOvertimePage.jsx";
import { useAttendance } from "../../attendance/hook/useAttendance.js";
import { useOvertime } from "../../overtime/hook/useOvertime.js";
import {
  Users, Timer, CheckCircle2,
  AlertCircle, TrendingUp, Search,
  ArrowRight, ShieldCheck,
} from "lucide-react";

/* ── colours — mirrors EmployeeDashboard ── */
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

/* ── Stat card — exactly same as EmployeeDashboard ── */
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

/* ── ManagerHome ── */
const ManagerHome = ({ setActivePage }) => {
  const { teamRecords }      = useSelector((s) => s.attendance);
  const { pendingOvertimes } = useSelector((s) => s.overtime);
  const { user }             = useSelector((s) => s.auth);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  const todayStr        = new Date().toISOString().split("T")[0];
  const todayRecords    = teamRecords.filter((r) => r.date === todayStr);
  const presentToday    = todayRecords.filter((r) => r.punchIn?.time).length;
  const completedToday  = todayRecords.filter((r) => r.status === "completed").length;
  const pendingOTCount  = pendingOvertimes.length;
  const pendingValidation = teamRecords.filter((r) => r.validationStatus === "pending").length;

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
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.t1, letterSpacing: "-0.3px" }}>
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h2>
          <p style={{ fontSize: 13, color: C.t2, marginTop: 3 }}>{today}</p>
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
              label="Present Today" value={presentToday}
              sub={`${completedToday} shifts completed`}
              Icon={Users} subColor={C.orange}
              iconBg="rgba(249,115,22,0.12)"
            />
            <StatCard
              label="Shifts Completed" value={completedToday}
              sub="↑ team on track today"
              Icon={TrendingUp} subColor={C.green}
              iconBg="rgba(34,197,94,0.12)"
            />
            <StatCard
              label="Overtime Requests" value={pendingOTCount}
              sub={pendingOTCount > 0 ? "Awaiting your approval" : "All clear"}
              Icon={Timer} subColor={C.red}
              iconBg="rgba(239,68,68,0.12)"
            />
          </div>

          {/* Team Attendance Table */}
          <div className="metric-card" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>Today's Team Attendance</p>
                <p style={{ fontSize: 12, color: C.t2, marginTop: 3 }}>Live status of your team members</p>
              </div>
              <button
                onClick={() => setActivePage("team")}
                style={{ fontSize: 12, fontWeight: 600, color: C.orange, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
              >
                View All <ArrowRight size={12} />
              </button>
            </div>

            <div style={{ overflowY: "auto", flex: 1 }}>
              {todayRecords.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 60, opacity: 0.6 }}>
                  <AlertCircle size={32} color={C.tm} style={{ marginBottom: 12 }} />
                  <p style={{ fontSize: 13, color: C.t2, fontWeight: 500 }}>No team records for today yet</p>
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                      {["EMPLOYEE", "PUNCH IN", "PUNCH OUT", "HOURS", "STATUS"].map((h, i) => (
                        <th key={h} style={{
                          paddingBottom: 10, fontSize: 10, fontWeight: 700,
                          color: C.tm, letterSpacing: "0.08em",
                          textAlign: i >= 3 ? "right" : "left",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {todayRecords.slice(0, 7).map((r) => (
                      <tr key={r._id} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: "12px 0" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{
                              width: 30, height: 30, borderRadius: "50%",
                              background: C.inner, border: `1px solid ${C.border}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 11, fontWeight: 700, color: C.t1, flexShrink: 0,
                            }}>
                              {(r.userId?.name || "?")[0].toUpperCase()}
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>
                              {r.userId?.name || "Unknown"}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "12px 0", fontSize: 13, color: C.t2 }}>
                          {r.punchIn?.time ? new Date(r.punchIn.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                        </td>
                        <td style={{ padding: "12px 0", fontSize: 13, color: C.t2 }}>
                          {r.punchOut?.time ? new Date(r.punchOut.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                        </td>
                        <td style={{ padding: "12px 0", fontSize: 13, fontWeight: 600, color: C.t1, textAlign: "right" }}>
                          {r.workingHours ? `${r.workingHours}h` : "—"}
                        </td>
                        <td style={{ padding: "12px 0", textAlign: "right" }}>
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
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ width: 268, display: "flex", flexDirection: "column", gap: GAP, flexShrink: 0 }}>

          {/* Validation / Action card */}
          <div className="metric-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{
              position: "absolute", top: -40, right: -40,
              width: 140, height: 140, borderRadius: "50%",
              background: "rgba(249,115,22,0.08)", filter: "blur(30px)", pointerEvents: "none",
            }} />

            <div style={{
              width: 64, height: 64, borderRadius: 16, marginBottom: 14,
              background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ShieldCheck size={28} color={C.orange} />
            </div>

            <p style={{ fontSize: 15, fontWeight: 700, color: C.t1, marginBottom: 6 }}>
              {pendingValidation > 0 ? "Action Required" : "All Validated"}
            </p>
            <p style={{ fontSize: 12, color: C.t2, lineHeight: 1.6, marginBottom: pendingValidation > 0 ? 18 : 0 }}>
              {pendingValidation > 0
                ? `${pendingValidation} attendance record${pendingValidation > 1 ? "s" : ""} need your validation.`
                : "Great! No pending validations right now."}
            </p>

            {pendingValidation > 0 && (
              <button
                onClick={() => setActivePage("team")}
                style={{
                  width: "100%", padding: "12px 0", borderRadius: 10, border: "none",
                  background: C.orange, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(249,115,22,0.3)", transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--color-accent-hover)"}
                onMouseLeave={e => e.currentTarget.style.background = C.orange}
              >
                Review Now
              </button>
            )}
          </div>

          {/* Overtime card */}
          <div className="metric-card">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Timer size={14} color={C.red} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>Overtime Requests</p>
            </div>
            <p style={{ fontSize: 12, color: C.t2, lineHeight: 1.6, marginBottom: 16 }}>
              {pendingOTCount > 0
                ? `${pendingOTCount} request${pendingOTCount > 1 ? "s" : ""} awaiting your approval.`
                : "No overtime requests pending at the moment."}
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{
                fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em",
                color: pendingOTCount > 0 ? C.red : C.tm,
              }}>
                {pendingOTCount > 0 ? `${pendingOTCount} Pending` : "No Requests"}
              </span>
              <button
                onClick={() => setActivePage("overtime")}
                style={{
                  fontSize: 12, fontWeight: 600, padding: "7px 14px", borderRadius: 8,
                  background: C.inner, border: `1px solid ${C.border}`,
                  color: C.t1, cursor: "pointer", transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#1e1e1e"}
                onMouseLeave={e => e.currentTarget.style.background = C.inner}
              >
                Manage
              </button>
            </div>
          </div>

          {/* Mini stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: GAP }}>
            {[
              { label: "Present",    value: presentToday,   color: C.green },
              { label: "Pending OT", value: pendingOTCount, color: C.red   },
            ].map(({ label, value, color }) => (
              <div key={label} className="metric-card" style={{ textAlign: "center", padding: "18px 12px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.tm, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>
                  {label}
                </p>
                <p style={{ fontSize: 26, fontWeight: 700, color, lineHeight: 1 }}>{value}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

/* ── Shell ── */
const ManagerDashboard = () => {
  const [activePage, setActivePage]         = useState("dashboard");
  const { handleGetTeamAttendance }         = useAttendance();
  const { handleGetPendingOvertimes }       = useOvertime();

  useEffect(() => {
    handleGetTeamAttendance();
    handleGetPendingOvertimes();
  }, []);

  const render = () => {
    switch (activePage) {
      case "dashboard": return <ManagerHome setActivePage={setActivePage} />;
      case "team":      return <TeamAttendancePage />;
      case "overtime":  return <PendingOvertimePage />;
      case "report":    return <ReportPage />;
      default:          return <ManagerHome setActivePage={setActivePage} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--color-bg-main)" }}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main style={{ flex: 1, overflowY: "auto" }}>{render()}</main>
    </div>
  );
};

export default ManagerDashboard;