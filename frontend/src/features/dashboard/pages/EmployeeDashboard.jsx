import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../../../shared/components/Sidebar.jsx";
import PunchPage from "../../attendance/pages/PunchPage.jsx";
import MyAttendancePage from "../../attendance/pages/MyAttendancePage.jsx";
import ReportPage from "../../attendance/pages/ReportPage.jsx";
import OvertimePage from "../../overtime/pages/OvertimePage.jsx";
import { useAttendance } from "../../attendance/hook/useAttendance.js";
import { useOvertime } from "../../overtime/hook/useOvertime.js";
import {
  CheckCircle2, TrendingUp, BarChart2,
  Search, Fingerprint, Timer,
} from "lucide-react";

/* ── colours ── */
const C = {
  bg:      "var(--color-bg-main)",
  card:    "var(--color-bg-card)",
  inner:   "var(--color-bg-inner)",
  border:  "var(--color-border-subtle)",
  orange:  "var(--color-accent-primary)",
  indigo:  "var(--color-accent-secondary)",
  green:   "var(--color-accent-success)",
  yellow:  "var(--color-accent-warning)",
  red:     "var(--color-accent-danger)",
  t1:      "var(--color-text-primary)",
  t2:      "var(--color-text-secondary)",
  tm:      "var(--color-text-muted)",
};

/* ── Stat card — Metric Flow style ── */
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

/* ── DashboardHome ── */
const DashboardHome = ({ setActivePage }) => {
  const { records }     = useSelector((s) => s.attendance);
  const { myOvertimes } = useSelector((s) => s.overtime);
  const { user }        = useSelector((s) => s.auth);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  const todayRecord   = records.find((r) => r.date === new Date().toISOString().split("T")[0]);
  const totalDays     = records.length;
  const completedDays = records.filter((r) => r.status === "completed").length;
  const weeklyHours   = records.slice(0, 5).reduce((a, r) => a + (r.workingHours || 0), 0).toFixed(1);
  const pendingOT     = myOvertimes.filter((o) => o.status === "pending").length;

  const isPunchedIn  = !!todayRecord?.punchIn?.time;
  const isPunchedOut = !!todayRecord?.punchOut?.time;

  const statusLabel = isPunchedOut ? "Completed" : isPunchedIn ? "On Duty" : "Off Duty";
  const statusColor = isPunchedOut || isPunchedIn ? C.green : C.t2;

  /* ── GAP constant — every section uses this ── */
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
          {/* Search */}
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
          {/* Avatar */}
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
      <div style={{
        flex: 1, display: "flex", gap: GAP,
        padding: PAD,
      }}>

        {/* ── LEFT (main) ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: GAP, minWidth: 0 }}>

          {/* Stat cards row — exactly like Metric Flow */}
          <div style={{ display: "flex", gap: GAP }}>
            <StatCard
              label="Status" value={statusLabel}
              sub={isPunchedOut ? "Shift complete" : isPunchedIn ? "Currently working" : "Not started"}
              Icon={CheckCircle2} subColor={statusColor}
              iconBg={`${statusColor}18`}
            />
            <StatCard
              label="Weekly Hours" value={`${weeklyHours}h`}
              sub="↑ on track · 40h target"
              Icon={TrendingUp} subColor={C.indigo}
              iconBg="rgba(99,102,241,0.12)"
            />
            <StatCard
              label="Total Records" value={totalDays}
              sub={`${completedDays} completed`}
              Icon={BarChart2} subColor={C.orange}
              iconBg="rgba(249,115,22,0.12)"
            />
          </div>

          {/* Recent Activity — clean table card */}
          <div className="metric-card" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Card header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>Recent Activity</p>
                <p style={{ fontSize: 12, color: C.t2, marginTop: 3 }}>Your attendance statistic report</p>
              </div>
              <button
                onClick={() => setActivePage("attendance")}
                style={{ fontSize: 12, fontWeight: 600, color: C.orange, background: "none", border: "none", cursor: "pointer" }}
              >
                View All
              </button>
            </div>

            {/* Table */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    {["DATE", "PUNCH IN", "PUNCH OUT", "HOURS"].map((h, i) => (
                      <th key={h} style={{
                        paddingBottom: 10, fontSize: 10, fontWeight: 700,
                        color: C.tm, letterSpacing: "0.08em",
                        textAlign: i === 3 ? "right" : "left",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", padding: "40px 0", fontSize: 13, color: C.tm }}>
                        No attendance records yet.
                      </td>
                    </tr>
                  ) : (
                    records.slice(0, 6).map((r) => (
                      <tr key={r._id} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: "13px 0", fontSize: 13, fontWeight: 600, color: C.t1 }}>{r.date}</td>
                        <td style={{ padding: "13px 0", fontSize: 13, color: C.t2 }}>
                          {r.punchIn?.time ? new Date(r.punchIn.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                        </td>
                        <td style={{ padding: "13px 0", fontSize: 13, color: C.t2 }}>
                          {r.punchOut?.time ? new Date(r.punchOut.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                        </td>
                        <td style={{ padding: "13px 0", textAlign: "right" }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginRight: 10 }}>
                            {r.workingHours ? `${r.workingHours}h` : "—"}
                          </span>
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ width: 268, display: "flex", flexDirection: "column", gap: GAP, flexShrink: 0 }}>

          {/* Shift / Punch card */}
          <div className="metric-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative", overflow: "hidden" }}>
            {/* Glow */}
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
              <Fingerprint size={28} color={C.orange} />
            </div>

            <p style={{ fontSize: 15, fontWeight: 700, color: C.t1, marginBottom: 6 }}>
              {isPunchedOut ? "Shift Complete" : isPunchedIn ? "You're On Duty" : "Start Your Shift"}
            </p>
            <p style={{ fontSize: 12, color: C.t2, lineHeight: 1.6, marginBottom: isPunchedOut ? 0 : 18 }}>
              {isPunchedOut
                ? "Great work today! Enjoy your time off."
                : isPunchedIn
                ? "Make sure to punch out before you leave."
                : "Time to record your attendance."}
            </p>

            {!isPunchedOut && (
              <button
                onClick={() => setActivePage("punch")}
                style={{
                  width: "100%", padding: "12px 0", borderRadius: 10, border: "none",
                  background: C.orange, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(249,115,22,0.3)", transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--color-accent-hover)"}
                onMouseLeave={e => e.currentTarget.style.background = C.orange}
              >
                {isPunchedIn ? "Punch Out Now" : "Punch In Now"}
              </button>
            )}
          </div>

          {/* Overtime card */}
          <div className="metric-card">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(99,102,241,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Timer size={14} color={C.indigo} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>Overtime</p>
            </div>
            <p style={{ fontSize: 12, color: C.t2, lineHeight: 1.6, marginBottom: 16 }}>
              Need extra time? Request overtime approval from your manager.
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{
                fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em",
                color: pendingOT > 0 ? C.yellow : C.tm,
              }}>
                {pendingOT > 0 ? `${pendingOT} Pending` : "No Requests"}
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
                Request
              </button>
            </div>
          </div>

          {/* Mini stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: GAP }}>
            {[
              { label: "Completed", value: completedDays, color: C.green },
              { label: "Pending OT", value: pendingOT,    color: C.t1 },
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
const EmployeeDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const { handleGetMyAttendance } = useAttendance();
  const { handleGetMyOvertimes }  = useOvertime();

  useEffect(() => {
    handleGetMyAttendance();
    handleGetMyOvertimes();
  }, []);

  const render = () => {
    switch (activePage) {
      case "dashboard":  return <DashboardHome setActivePage={setActivePage} />;
      case "punch":      return <PunchPage />;
      case "attendance": return <MyAttendancePage />;
      case "overtime":   return <OvertimePage />;
      case "report":     return <ReportPage />;
      default:           return <DashboardHome setActivePage={setActivePage} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--color-bg-main)" }}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main style={{ flex: 1, overflowY: "auto" }}>{render()}</main>
    </div>
  );
};

export default EmployeeDashboard;