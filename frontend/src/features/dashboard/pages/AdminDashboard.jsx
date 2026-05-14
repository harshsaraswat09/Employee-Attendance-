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
  Users,
  CalendarDays,
  Timer,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Shield,
  FileText,
} from "lucide-react";

const AdminHome = ({ setActivePage }) => {
  const { allRecords } = useSelector((state) => state.attendance);
  const { pendingOvertimes } = useSelector((state) => state.overtime);
  const { users } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const todayStr = new Date().toISOString().split("T")[0];

  const todayRecords = allRecords.filter((r) => r.date === todayStr);
  const presentToday = todayRecords.filter((r) => r.punchIn?.time).length;
  const invalidRecords = allRecords.filter((r) => r.validationStatus === "invalid").length;
  const pendingValidation = allRecords.filter((r) => r.validationStatus === "pending" && r.punchIn?.time).length;
  const totalEmployees = users.filter((u) => u.role === "employee").length;
  const totalManagers = users.filter((u) => u.role === "manager").length;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[var(--color-bg-main)]">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--color-border-subtle)]">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
             <div className="p-1 rounded bg-[var(--color-accent-primary)]/10">
                 <Shield size={16} className="text-[var(--color-accent-primary)]" />
             </div>
             <h2 className="text-xl font-bold text-white tracking-wide">Admin Control Center</h2>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] ml-9">{today}</p>
        </div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm bg-[var(--color-accent-primary)] ring-2 ring-white/10 shadow-lg shadow-[var(--color-accent-primary)]/20">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Total Users", value: users.length, icon: <Users size={16} className="text-[var(--color-accent-primary)]" />, accent: "var(--color-accent-primary)" },
            { label: "Present Today", value: presentToday, icon: <CalendarDays size={16} className="text-[var(--color-accent-success)]" />, accent: "var(--color-accent-success)" },
            { label: "Pending Overtime", value: pendingOvertimes.length, icon: <Timer size={16} className="text-[var(--color-accent-warning)]" />, accent: "var(--color-accent-warning)" },
            { label: "Invalid Records", value: invalidRecords, icon: <XCircle size={16} className="text-[var(--color-accent-danger)]" />, accent: "var(--color-accent-danger)" },
          ].map((s) => (
            <div key={s.label} className="metric-card shadow-sm border border-[var(--color-border-subtle)]">
              <div className="flex items-center gap-2.5 mb-4">
                 <div className="p-1.5 rounded bg-white/5 border border-white/10">
                     {s.icon}
                 </div>
                 <p className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">{s.label}</p>
              </div>
              <p className="text-3xl font-bold" style={{ color: s.accent }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Users Breakdown */}
          <div className="metric-card shadow-sm border border-[var(--color-border-subtle)] flex flex-col h-[360px]">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-[var(--color-accent-primary)]/10">
                     <Users size={16} className="text-[var(--color-accent-primary)]" />
                  </div>
                  <p className="text-base font-bold text-white tracking-wide">User Breakdown</p>
               </div>
            </div>
            
            <div className="flex-1 space-y-5">
              {[
                { label: "Employees", count: totalEmployees, color: "var(--color-accent-primary)" },
                { label: "Managers", count: totalManagers, color: "var(--color-accent-success)" },
                { label: "Admins", count: users.filter((u) => u.role === "admin").length, color: "var(--color-accent-warning)" },
              ].map((item) => (
                <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-[var(--color-text-secondary)]">{item.label}</p>
                        <p className="text-sm font-bold text-white">{item.count}</p>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--color-bg-main)] w-full overflow-hidden">
                       <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.max((item.count / (users.length || 1)) * 100, 2)}%`, backgroundColor: item.color }} />
                    </div>
                </div>
              ))}
            </div>
            <button onClick={() => setActivePage("users")} className="flex items-center justify-center gap-2 text-xs font-semibold py-3 mt-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-main)] hover:bg-white/5 transition-colors text-white">
              View all users <ArrowRight size={14} />
            </button>
          </div>

          {/* Today's Attendance Summary */}
          <div className="metric-card shadow-sm border border-[var(--color-border-subtle)] flex flex-col h-[360px]">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-[var(--color-accent-success)]/10">
                     <CalendarDays size={16} className="text-[var(--color-accent-success)]" />
                  </div>
                  <p className="text-base font-bold text-white tracking-wide">Today's Summary</p>
               </div>
              <button onClick={() => setActivePage("attendance")} className="flex items-center gap-1 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-white transition-colors">
                View all <ArrowRight size={12} />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto pr-2">
                {todayRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-60">
                    <AlertCircle size={32} className="mb-3 text-[var(--color-text-muted)]" />
                    <p className="text-sm font-medium text-[var(--color-text-secondary)]">No records today yet</p>
                </div>
                ) : (
                <table className="w-full text-left border-collapse">
                    <tbody>
                        {todayRecords.slice(0, 5).map((r) => (
                        <tr key={r._id} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-card-hover)] transition-colors">
                            <td className="py-2.5">
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-[var(--color-bg-main)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)]">
                                        {(r.userId?.name || "?")[0].toUpperCase()}
                                    </div>
                                    <p className="text-sm font-medium text-white">{r.userId?.name}</p>
                                </div>
                            </td>
                            <td className="py-2.5 text-right">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center justify-center w-fit ml-auto
                                    ${r.status === 'completed' ? 'bg-[var(--color-accent-success)]/10 text-[var(--color-accent-success)]' : 'bg-[var(--color-accent-warning)]/10 text-[var(--color-accent-warning)]'}`}
                                >
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
          <div className="metric-card shadow-sm border border-[var(--color-border-subtle)] flex flex-col h-[360px]">
             <div className="flex items-center gap-2.5 mb-6">
                <p className="text-base font-bold text-white tracking-wide">Quick Actions</p>
             </div>
             
             <div className="flex flex-col gap-4">
                {[
                { label: "Review Pending Overtime", sub: `${pendingOvertimes.length} awaiting`, page: "overtime", icon: <Timer size={18} className="text-[var(--color-accent-warning)]" />, bg: "bg-[var(--color-accent-warning)]/10" },
                { label: "Validate Attendance", sub: `${pendingValidation} pending`, page: "attendance", icon: <CheckCircle size={18} className="text-[var(--color-accent-success)]" />, bg: "bg-[var(--color-accent-success)]/10" },
                { label: "Generate Report", sub: "Daily attendance report", page: "report", icon: <FileText size={18} className="text-[var(--color-accent-primary)]" />, bg: "bg-[var(--color-accent-primary)]/10" },
                ].map((action) => (
                <button key={action.label} onClick={() => setActivePage(action.page)}
                    className="group flex items-center gap-4 p-4 rounded-xl text-left transition-all border border-[var(--color-border-subtle)] bg-[var(--color-bg-main)] hover:bg-[var(--color-bg-card-hover)]"
                >
                    <div className={`p-2 rounded-lg ${action.bg}`}>
                        {action.icon}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white group-hover:text-[var(--color-accent-primary)] transition-colors">{action.label}</p>
                        <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)] mt-0.5">{action.sub}</p>
                    </div>
                    <ArrowRight size={16} className="ml-auto text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-primary)] transition-colors" />
                </button>
                ))}
            </div>
          </div>
        </div>

        {/* All Users Table */}
        {users.length > 0 && (
          <div className="metric-card shadow-sm border border-[var(--color-border-subtle)]">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2.5">
                  <p className="text-base font-bold text-white tracking-wide">Recent Users</p>
               </div>
              <button onClick={() => setActivePage("users")} className="flex items-center gap-1 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-white transition-colors">
                View all <ArrowRight size={12} />
              </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="border-b border-[var(--color-border-subtle)] text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                            <th className="pb-3 pl-2">Name</th>
                            <th className="pb-3">Email</th>
                            <th className="pb-3 text-center">Role</th>
                            <th className="pb-3 text-right pr-2">Department</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.slice(0, 5).map((u) => (
                            <tr key={u._id} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-card-hover)] transition-colors">
                                <td className="py-3 pl-2 font-medium text-sm text-white">{u.name}</td>
                                <td className="py-3 text-sm text-[var(--color-text-secondary)]">{u.email}</td>
                                <td className="py-3 text-center">
                                    <span className={`capitalize text-[10px] font-bold px-3 py-1 rounded inline-block
                                        ${u.role === 'admin' ? 'bg-[var(--color-accent-warning)]/10 text-[var(--color-accent-warning)] border border-[var(--color-accent-warning)]/20' 
                                        : u.role === 'manager' ? 'bg-[var(--color-accent-success)]/10 text-[var(--color-accent-success)] border border-[var(--color-accent-success)]/20' 
                                        : 'bg-white/5 text-[var(--color-text-secondary)] border border-white/10'}`}
                                    >
                                        {u.role}
                                    </span>
                                </td>
                                <td className="py-3 pr-2 text-sm text-right text-[var(--color-text-secondary)]">{u.department || "—"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AllUsersPage = () => {
  const { users, loading } = useSelector((state) => state.user);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = users.filter((u) => {
    const nameMatch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const roleMatch = roleFilter === "all" || u.role === roleFilter;
    return nameMatch && roleMatch;
  });

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-main)]">
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-[var(--color-bg-main)]">
      <div className="mb-8">
          <h2 className="text-3xl font-bold text-white tracking-wide mb-2">All Users</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">Manage and monitor all registered users in the system</p>
      </div>

      <div className="flex gap-4 mb-8">
        <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="px-5 py-3 rounded-xl text-sm outline-none flex-1 bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] text-white placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-primary)]/50 transition-colors"
        />
        <div className="flex gap-2">
            {["all", "employee", "manager", "admin"].map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)}
                className={`px-5 py-3 rounded-xl text-sm font-bold capitalize transition-all border
                    ${roleFilter === r 
                        ? "bg-[var(--color-accent-primary)] border-[var(--color-accent-primary)] text-white shadow-lg shadow-[var(--color-accent-primary)]/20" 
                        : "bg-[var(--color-bg-card)] border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-white"}`}
            >
                {r}
            </button>
            ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="metric-card flex flex-col items-center justify-center h-64 border border-[var(--color-border-subtle)]">
          <AlertCircle size={48} className="mb-4 text-[var(--color-text-muted)]" />
          <p className="text-base font-medium text-[var(--color-text-secondary)]">No users found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((u) => (
            <div key={u._id} className="metric-card shadow-sm border border-[var(--color-border-subtle)] hover:border-[var(--color-accent-primary)]/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                 <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white bg-[var(--color-accent-primary)] ring-4 ring-[var(--color-accent-primary)]/10">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <span className={`capitalize text-[10px] font-bold px-3 py-1 rounded inline-block
                        ${u.role === 'admin' ? 'bg-[var(--color-accent-warning)]/10 text-[var(--color-accent-warning)] border border-[var(--color-accent-warning)]/20' 
                        : u.role === 'manager' ? 'bg-[var(--color-accent-success)]/10 text-[var(--color-accent-success)] border border-[var(--color-accent-success)]/20' 
                        : 'bg-white/5 text-[var(--color-text-secondary)] border border-white/10'}`}
                    >
                    {u.role}
                  </span>
              </div>
              
              <div>
                 <p className="font-bold text-lg text-white mb-1">{u.name}</p>
                 <p className="text-sm text-[var(--color-text-secondary)] mb-4">{u.email}</p>
              </div>
              
              <div className="pt-4 border-t border-[var(--color-border-subtle)]">
                  <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Department</p>
                  <p className="text-sm font-medium text-white">{u.department || "Unassigned"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const { handleGetAllAttendance } = useAttendance();
  const { handleGetPendingOvertimes } = useOvertime();
  const { handleGetAllUsers } = useUser();

  useEffect(() => {
    handleGetAllAttendance();
    handleGetPendingOvertimes();
    handleGetAllUsers();
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <AdminHome setActivePage={setActivePage} />;
      case "attendance": return <AllAttendancePage />;
      case "users": return <AllUsersPage />;
      case "overtime": return <PendingOvertimePage />;
      case "report": return <ReportPage />;
      default: return <AdminHome setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-main)]">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 overflow-y-auto">{renderPage()}</main>
    </div>
  );
};

export default AdminDashboard;