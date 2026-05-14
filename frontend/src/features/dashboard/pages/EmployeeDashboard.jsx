import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../shared/components/Sidebar.jsx";
import PunchPage from "../../attendance/pages/PunchPage.jsx";
import MyAttendancePage from "../../attendance/pages/MyAttendancePage.jsx";
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

  const statusColor = isPunchedOut
    ? "#c8f135"
    : isPunchedIn
    ? "#4ade80"
    : "#888888";

  return (
    <div className="flex-1 flex flex-col min-h-screen" style={{ backgroundColor: "#0a0a0a" }}>

      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-5"
        style={{ borderBottom: "1px solid #1f1f1f" }}
      >
        <div>
          <h2 className="text-xl font-bold text-white">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "#888888" }}>{today}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}
          >
            <Search size={14} style={{ color: "#888888" }} />
            <input
              type="text"
              placeholder="Search records..."
              className="bg-transparent text-sm outline-none w-36"
              style={{ color: "#888888" }}
            />
          </div>
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-black text-sm"
            style={{ backgroundColor: "#c8f135" }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-6 p-8">
        {/* Left — Main Content */}
        <div className="flex-1 space-y-6">

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Status */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}>
              <p className="text-xs font-medium mb-3" style={{ color: "#888888" }}>Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
                <p className="text-lg font-bold text-white">{currentStatus}</p>
              </div>
            </div>

            {/* Weekly Hours */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}>
              <p className="text-xs font-medium mb-3" style={{ color: "#888888" }}>Weekly Hours</p>
              <div className="flex items-end gap-1">
                <p className="text-3xl font-bold text-white">{weeklyHours}</p>
                <p className="text-sm mb-1" style={{ color: "#888888" }}>h / 40h</p>
              </div>
            </div>

            {/* Total Records */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}>
              <p className="text-xs font-medium mb-3" style={{ color: "#888888" }}>Total Records</p>
              <p className="text-3xl font-bold text-white">{totalDays}</p>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-semibold text-white">Recent Activity</p>
              <button
                onClick={() => setActivePage("attendance")}
                className="text-xs transition"
                style={{ color: "#888888" }}
              >
                View all →
              </button>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-4 mb-3">
              {["DATE", "PUNCH IN", "PUNCH OUT", "HOURS"].map((h) => (
                <p key={h} className="text-xs font-semibold tracking-widest"
                  style={{ color: "#444444" }}
                >
                  {h}
                </p>
              ))}
            </div>

            {/* Table Rows */}
            {records.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: "#444444" }}>
                No attendance records yet.
              </p>
            ) : (
              <div className="space-y-3">
                {records.slice(0, 5).map((record) => (
                  <div key={record._id} className="grid grid-cols-4 py-2"
                    style={{ borderTop: "1px solid #1f1f1f" }}
                  >
                    <p className="text-sm text-white">{record.date}</p>
                    <p className="text-sm" style={{ color: "#888888" }}>
                      {record.punchIn?.time
                        ? new Date(record.punchIn.time).toLocaleTimeString()
                        : "--"}
                    </p>
                    <p className="text-sm" style={{ color: "#888888" }}>
                      {record.punchOut?.time
                        ? new Date(record.punchOut.time).toLocaleTimeString()
                        : "--"}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-white">
                        {record.workingHours ? `${record.workingHours}h` : "--"}
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: record.status === "completed" ? "#1a2e0a" : "#2e1f0a",
                          color: record.status === "completed" ? "#c8f135" : "#f59e0b",
                        }}
                      >
                        {record.status === "completed" ? "Done" : "Incomplete"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — Action Cards */}
        <div className="w-72 space-y-4">

          {/* Punch Card */}
          <div className="rounded-2xl p-6 flex flex-col items-center text-center"
            style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: "#1a1a1a" }}
            >
              <Fingerprint size={32} style={{ color: "#c8f135" }} />
            </div>
            <p className="text-base font-bold text-white mb-1">
              {isPunchedOut ? "Shift Complete" : isPunchedIn ? "You're On Duty" : "Start your shift"}
            </p>
            <p className="text-xs mb-5" style={{ color: "#888888" }}>
              {isPunchedOut
                ? "Great work today!"
                : isPunchedIn
                ? "Don't forget to punch out"
                : "Time to record your attendance."}
            </p>
            {!isPunchedOut && (
              <button
                onClick={() => setActivePage("punch")}
                className="w-full py-3 rounded-xl font-semibold text-sm text-black transition hover:opacity-90"
                style={{ backgroundColor: "#c8f135" }}
              >
                {isPunchedIn ? "Punch Out Now" : "Punch In Now"}
              </button>
            )}
          </div>

          {/* Overtime Card */}
          <div className="rounded-2xl p-6"
            style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Timer size={16} style={{ color: "#c8f135" }} />
              <p className="text-sm font-bold text-white">Overtime</p>
            </div>
            <p className="text-xs mb-4" style={{ color: "#888888" }}>
              Need extra time? Request overtime approval from your manager.
            </p>
            {pendingOT > 0 && (
              <p className="text-xs mb-3" style={{ color: "#c8f135" }}>
                {pendingOT} request(s) pending
              </p>
            )}
            <button
              onClick={() => setActivePage("overtime")}
              className="flex items-center gap-2 text-sm font-medium transition"
              style={{ color: "#888888" }}
            >
              <Timer size={14} />
              Request Overtime
            </button>
          </div>

          {/* Stats Mini */}
          <div className="rounded-2xl p-5 grid grid-cols-2 gap-3"
            style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}
          >
            <div>
              <p className="text-xs mb-1" style={{ color: "#888888" }}>Completed</p>
              <p className="text-xl font-bold" style={{ color: "#c8f135" }}>{completedDays}</p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: "#888888" }}>Pending OT</p>
              <p className="text-xl font-bold text-white">{pendingOT}</p>
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
      default: return <DashboardHome setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#0a0a0a" }}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
};

export default EmployeeDashboard;