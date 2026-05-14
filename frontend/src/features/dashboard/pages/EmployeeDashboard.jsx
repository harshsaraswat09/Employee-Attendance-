import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../shared/components/Sidebar.jsx";
import PunchPage from "../../attendance/pages/PunchPage.jsx";
import MyAttendancePage from "../../attendance/pages/MyAttendancePage.jsx";
import ReportPage from "../../attendance/pages/ReportPage.jsx";
import OvertimePage from "../../overtime/pages/OvertimePage.jsx";
import { useAttendance } from "../../attendance/hook/useAttendance.js";
import { useOvertime } from "../../overtime/hook/useOvertime.js";
import {
  CalendarDays,
  CheckCircle,
  Clock,
  Timer,
  Search,
  Fingerprint,
  TrendingUp,
} from "lucide-react";

const DashboardHome = ({ setActivePage }) => {
  const { records } = useSelector((state) => state.attendance);
  const { myOvertimes } = useSelector((state) => state.overtime);
  const { user } = useSelector((state) => state.auth);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const todayRecord = records.find(
    (r) => r.date === new Date().toISOString().split("T")[0]
  );

  const totalDays = records.length;
  const completedDays = records.filter((r) => r.status === "completed").length;
  const weeklyHours = records
    .slice(0, 5)
    .reduce((acc, r) => acc + (r.workingHours || 0), 0)
    .toFixed(1);
  const pendingOT = myOvertimes.filter((o) => o.status === "pending").length;

  const isPunchedIn = !!todayRecord?.punchIn?.time;
  const isPunchedOut = !!todayRecord?.punchOut?.time;

  const currentStatus = isPunchedOut
    ? "Completed"
    : isPunchedIn
    ? "On Duty"
    : "Off Duty";

  const statusColorClass = isPunchedOut
    ? "text-[var(--color-accent-success)] bg-[var(--color-accent-success)]"
    : isPunchedIn
    ? "text-[var(--color-accent-success)] bg-[var(--color-accent-success)]"
    : "text-[var(--color-text-secondary)] bg-[var(--color-text-secondary)]";

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[var(--color-bg-main)]">

      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--color-border-subtle)]">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h2>
          <p className="text-sm mt-1 text-[var(--color-text-secondary)]">{today}</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)]">
            <Search size={16} className="text-[var(--color-text-secondary)]" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm outline-none w-48 text-[var(--color-text-secondary)] placeholder:text-[var(--color-text-muted)]"
            />
          </div>
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm bg-[var(--color-accent-primary)] ring-2 ring-white/10 shadow-lg shadow-[var(--color-accent-primary)]/20">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-6 p-8">
        {/* Left — Main Content */}
        <div className="flex-1 space-y-6">

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-6">
            {/* Status */}
            <div className="metric-card shadow-sm">
              <p className="text-xs font-semibold mb-3 text-[var(--color-text-secondary)] uppercase tracking-wider">Status</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${statusColorClass.split(' ')[1]}`} />
                  <p className="text-2xl font-bold text-white">{currentStatus}</p>
                </div>
              </div>
            </div>

            {/* Weekly Hours */}
            <div className="metric-card shadow-sm">
              <p className="text-xs font-semibold mb-3 text-[var(--color-text-secondary)] uppercase tracking-wider flex justify-between">
                Weekly Hours
                <span className="flex items-center text-[var(--color-accent-secondary)] gap-1 lowercase text-[10px]">
                  <TrendingUp size={12} />
                  on track
                </span>
              </p>
              <div className="flex items-end gap-1.5">
                <p className="text-3xl font-bold text-white leading-none">{weeklyHours}</p>
                <p className="text-sm text-[var(--color-text-secondary)] mb-0.5">/ 40h</p>
              </div>
            </div>

            {/* Total Records */}
            <div className="metric-card shadow-sm">
              <p className="text-xs font-semibold mb-3 text-[var(--color-text-secondary)] uppercase tracking-wider">Total Records</p>
              <p className="text-3xl font-bold text-white leading-none">{totalDays}</p>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="metric-card h-[400px] flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <p className="text-base font-bold text-white">Recent Activity</p>
              <button
                onClick={() => setActivePage("attendance")}
                className="text-xs font-semibold transition text-[var(--color-text-secondary)] hover:text-white"
              >
                View All
              </button>
            </div>

            <div className="flex-1 overflow-auto pr-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border-subtle)] text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                    <th className="pb-3 pl-2 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Punch In</th>
                    <th className="pb-3 font-semibold">Punch Out</th>
                    <th className="pb-3 font-semibold text-right pr-2">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-sm text-center py-12 text-[var(--color-text-muted)]">
                        No attendance records yet.
                      </td>
                    </tr>
                  ) : (
                    records.slice(0, 6).map((record) => (
                      <tr key={record._id} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-card-hover)] transition-colors">
                        <td className="py-3 pl-2 text-sm text-white font-medium">{record.date}</td>
                        <td className="py-3 text-sm text-[var(--color-text-secondary)]">
                          {record.punchIn?.time
                            ? new Date(record.punchIn.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                            : "--"}
                        </td>
                        <td className="py-3 text-sm text-[var(--color-text-secondary)]">
                          {record.punchOut?.time
                            ? new Date(record.punchOut.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                            : "--"}
                        </td>
                        <td className="py-3 text-sm text-right pr-2">
                           <div className="flex items-center justify-end gap-3">
                            <p className="text-white font-medium">
                              {record.workingHours ? `${record.workingHours}h` : "--"}
                            </p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1
                                ${record.status === 'completed' ? 'bg-[var(--color-accent-success)]/10 text-[var(--color-accent-success)]' : 'bg-[var(--color-accent-warning)]/10 text-[var(--color-accent-warning)]'}`}
                            >
                              {record.status === "completed" ? "Done" : "Active"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right — Action Cards */}
        <div className="w-80 space-y-6">

          {/* Punch Card */}
          <div className="metric-card flex flex-col items-center text-center shadow-sm border border-[var(--color-border-subtle)] relative overflow-hidden">
             {/* Decorative glow */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent-primary)]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-[var(--color-accent-primary)]/10 border border-[var(--color-accent-primary)]/20 shadow-inner">
              <Fingerprint size={28} className="text-[var(--color-accent-primary)]" />
            </div>
            <p className="text-lg font-bold text-white mb-2">
              {isPunchedOut ? "Shift Complete" : isPunchedIn ? "You're On Duty" : "Start your shift"}
            </p>
            <p className="text-xs mb-6 text-[var(--color-text-secondary)] leading-relaxed">
              {isPunchedOut
                ? "Great work today! Enjoy your time off."
                : isPunchedIn
                ? "Make sure to punch out before you leave."
                : "Time to record your attendance."}
            </p>
            {!isPunchedOut && (
              <button
                onClick={() => setActivePage("punch")}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all shadow-lg hover:shadow-[var(--color-accent-primary)]/20 active:scale-[0.98] bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-hover)]"
              >
                {isPunchedIn ? "Punch Out Now" : "Punch In Now"}
              </button>
            )}
          </div>

          {/* Overtime Card */}
          <div className="metric-card shadow-sm border border-[var(--color-border-subtle)] hover:border-[var(--color-border-subtle)]/80 transition-colors">
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-[var(--color-accent-secondary)]/10">
                   <Timer size={16} className="text-[var(--color-accent-secondary)]" />
                </div>
                <p className="text-sm font-bold text-white tracking-wide">Overtime</p>
              </div>
            </div>
            
            <p className="text-xs mb-5 text-[var(--color-text-secondary)] leading-relaxed">
              Need extra time? Request overtime approval from your manager.
            </p>

            <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  {pendingOT > 0 ? (
                    <span className="text-[10px] font-bold text-[var(--color-accent-warning)] uppercase tracking-wider">
                      {pendingOT} Pending
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                      No Requests
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setActivePage("overtime")}
                  className="text-xs font-semibold px-4 py-2 rounded-lg bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] hover:bg-white/5 transition-colors text-white"
                >
                  Request
                </button>
            </div>
          </div>

          {/* Stats Mini */}
          <div className="metric-card p-5 grid grid-cols-2 gap-4 shadow-sm border border-[var(--color-border-subtle)]">
            <div className="bg-[var(--color-bg-main)] rounded-xl p-4 border border-[var(--color-border-subtle)] flex flex-col justify-center text-center">
              <p className="text-[10px] font-bold mb-1.5 text-[var(--color-text-muted)] uppercase tracking-wider">Completed</p>
              <p className="text-2xl font-bold text-[var(--color-accent-success)]">{completedDays}</p>
            </div>
            <div className="bg-[var(--color-bg-main)] rounded-xl p-4 border border-[var(--color-border-subtle)] flex flex-col justify-center text-center">
              <p className="text-[10px] font-bold mb-1.5 text-[var(--color-text-muted)] uppercase tracking-wider">Pending OT</p>
              <p className="text-2xl font-bold text-white">{pendingOT}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const EmployeeDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const { handleGetMyAttendance } = useAttendance();
  const { handleGetMyOvertimes } = useOvertime();

  useEffect(() => {
    handleGetMyAttendance();
    handleGetMyOvertimes();
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <DashboardHome setActivePage={setActivePage} />;
      case "punch": return <PunchPage />;
      case "attendance": return <MyAttendancePage />;
      case "overtime": return <OvertimePage />;
      case "report": return <ReportPage />;
      default: return <DashboardHome setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-primary)]">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
};

export default EmployeeDashboard;