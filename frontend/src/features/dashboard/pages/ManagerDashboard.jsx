import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../../../shared/components/Sidebar.jsx";
import TeamAttendancePage from "../../attendance/pages/TeamAttendancePage.jsx";
import ReportPage from "../../attendance/pages/ReportPage.jsx";
import PendingOvertimePage from "../../overtime/pages/PendingOvertimePage.jsx";
import { useAttendance } from "../../attendance/hook/useAttendance.js";
import { useOvertime } from "../../overtime/hook/useOvertime.js";
import {
  Users,
  CalendarDays,
  Timer,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

const ManagerHome = ({ setActivePage }) => {
  const { teamRecords } = useSelector((state) => state.attendance);
  const { pendingOvertimes } = useSelector((state) => state.overtime);
  const { user } = useSelector((state) => state.auth);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const todayStr = new Date().toISOString().split("T")[0];
  const todayRecords = teamRecords.filter((r) => r.date === todayStr);
  const presentToday = todayRecords.filter((r) => r.punchIn?.time).length;
  const completedToday = todayRecords.filter((r) => r.status === "completed").length;
  const pendingValidation = teamRecords.filter(
    (r) => r.validationStatus === "pending"
  ).length;
  const pendingOTCount = pendingOvertimes.length;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[var(--color-bg-main)]">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--color-border-subtle)]">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h2>
          <p className="text-sm mt-1 text-[var(--color-text-secondary)]">
            {today}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm bg-[var(--color-accent-primary)] ring-2 ring-white/10 shadow-lg shadow-[var(--color-accent-primary)]/20">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              label: "Present Today",
              value: presentToday,
              icon: <Users size={16} className="text-[var(--color-accent-primary)]" />,
              accent: "var(--color-accent-primary)",
            },
            {
              label: "Shifts Completed",
              value: completedToday,
              icon: <CheckCircle size={16} className="text-[var(--color-accent-success)]" />,
              accent: "var(--color-accent-success)",
            },
            {
              label: "Pending Validation",
              value: pendingValidation,
              icon: <Clock size={16} className="text-[var(--color-accent-warning)]" />,
              accent: "var(--color-accent-warning)",
            },
            {
              label: "Overtime Requests",
              value: pendingOTCount,
              icon: <Timer size={16} className="text-[var(--color-accent-danger)]" />,
              accent: "var(--color-accent-danger)",
            },
          ].map((stat) => (
            <div key={stat.label} className="metric-card shadow-sm border border-[var(--color-border-subtle)]">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-1.5 rounded bg-white/5 border border-white/10">
                   {stat.icon}
                </div>
                <p className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
              <p className="text-3xl font-bold" style={{ color: stat.accent }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Team Attendance Quick View */}
          <div className="metric-card shadow-sm border border-[var(--color-border-subtle)] flex flex-col h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-[var(--color-accent-primary)]/10">
                  <CalendarDays size={16} className="text-[var(--color-accent-primary)]" />
                </div>
                <p className="text-base font-bold text-white tracking-wide">Today's Team</p>
              </div>
              <button
                onClick={() => setActivePage("team")}
                className="flex items-center gap-1 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-white transition-colors"
              >
                View all <ArrowRight size={12} />
              </button>
            </div>

            <div className="flex-1 overflow-auto pr-2">
              {todayRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-60">
                  <AlertCircle size={32} className="mb-3 text-[var(--color-text-muted)]" />
                  <p className="text-sm text-[var(--color-text-secondary)] font-medium">
                    No records for today yet
                  </p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                    <tbody>
                        {todayRecords.slice(0, 6).map((record) => (
                          <tr key={record._id} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-card-hover)] transition-colors">
                            <td className="py-3 pl-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-[var(--color-bg-main)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)]">
                                    {(record.userId?.name || "?")[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-white">
                                      {record.userId?.name || "Unknown"}
                                    </p>
                                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)] mt-0.5">
                                      {record.workingHours ? `${record.workingHours}h worked` : "In progress"}
                                    </p>
                                  </div>
                                </div>
                            </td>
                            <td className="py-3 pr-2 text-right">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center justify-center w-fit ml-auto
                                    ${record.status === 'completed' ? 'bg-[var(--color-accent-success)]/10 text-[var(--color-accent-success)]' : 'bg-[var(--color-accent-warning)]/10 text-[var(--color-accent-warning)]'}`}
                                >
                                  {record.status === "completed" ? "Done" : "Active"}
                                </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Pending Overtime Quick View */}
          <div className="metric-card shadow-sm border border-[var(--color-border-subtle)] flex flex-col h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-[var(--color-accent-danger)]/10">
                  <Timer size={16} className="text-[var(--color-accent-danger)]" />
                </div>
                <p className="text-base font-bold text-white tracking-wide">Overtime Requests</p>
              </div>
              <button
                onClick={() => setActivePage("overtime")}
                className="flex items-center gap-1 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-white transition-colors"
              >
                View all <ArrowRight size={12} />
              </button>
            </div>

            <div className="flex-1 overflow-auto pr-2">
              {pendingOvertimes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-60">
                  <CheckCircle size={32} className="mb-3 text-[var(--color-accent-success)]" />
                  <p className="text-sm text-[var(--color-text-secondary)] font-medium">
                    No pending overtime requests
                  </p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                    <tbody>
                        {pendingOvertimes.slice(0, 6).map((ot) => (
                          <tr key={ot._id} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-card-hover)] transition-colors">
                            <td className="py-3 pl-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-[var(--color-bg-main)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)]">
                                    {(ot.userId?.name || "?")[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-white">
                                      {ot.userId?.name || "Unknown"}
                                    </p>
                                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)] mt-0.5">
                                      {ot.attendanceId?.date}
                                    </p>
                                  </div>
                                </div>
                            </td>
                            <td className="py-3">
                                <p className="text-xs font-bold text-[var(--color-accent-danger)]">{ot.requestedHours}h</p>
                            </td>
                            <td className="py-3 pr-2 text-right">
                                <button
                                  onClick={() => setActivePage("overtime")}
                                  className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded border border-[var(--color-border-subtle)] bg-[var(--color-bg-main)] hover:bg-white/5 transition-colors text-white"
                                >
                                  Review
                                </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ManagerDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const { handleGetTeamAttendance } = useAttendance();
  const { handleGetPendingOvertimes } = useOvertime();

  useEffect(() => {
    handleGetTeamAttendance();
    handleGetPendingOvertimes();
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <ManagerHome setActivePage={setActivePage} />;
      case "team":
        return <TeamAttendancePage />;
      case "overtime":
        return <PendingOvertimePage />;
      case "report":
        return <ReportPage />;
      default:
        return <ManagerHome setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-primary)]">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 overflow-y-auto">{renderPage()}</main>
    </div>
  );
};

export default ManagerDashboard;