import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAttendance } from "../hook/useAttendance.js";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

const MyAttendancePage = () => {
  const { handleGetMyAttendance } = useAttendance();
  const { records, loading } = useSelector((state) => state.attendance);

  useEffect(() => {
    handleGetMyAttendance();
  }, []);

  const getStatusBadge = (status) => {
    if (status === "completed")
      return (
        <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-[var(--color-accent-success)]/10 text-[var(--color-accent-success)] border border-[var(--color-accent-success)]/20">
          <CheckCircle size={12} /> Completed
        </span>
      );
    return (
      <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-[var(--color-accent-warning)]/10 text-[var(--color-accent-warning)] border border-[var(--color-accent-warning)]/20">
        <Clock size={12} /> Incomplete
      </span>
    );
  };

  const getValidationBadge = (status) => {
    if (status === "valid")
      return <span className="text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-[var(--color-accent-success)]/10 text-[var(--color-accent-success)] border border-[var(--color-accent-success)]/20">Valid</span>;
    if (status === "invalid")
      return <span className="text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-[var(--color-accent-danger)]/10 text-[var(--color-accent-danger)] border border-[var(--color-accent-danger)]/20">Invalid</span>;
    return <span className="text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-white/5 text-[var(--color-text-secondary)] border border-white/10">Pending</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-main)]">
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">Loading attendance...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-[var(--color-bg-main)]">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-wide mb-2">My Attendance</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">Your personal attendance history</p>
      </div>

      {records.length === 0 ? (
        <div className="metric-card flex flex-col items-center justify-center h-64 border border-[var(--color-border-subtle)]">
          <AlertCircle size={48} className="mb-4 text-[var(--color-text-muted)] opacity-50" />
          <p className="text-base font-medium text-[var(--color-text-secondary)]">No attendance records found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record._id} className="metric-card shadow-sm border border-[var(--color-border-subtle)] hover:border-[var(--color-accent-primary)]/30 transition-colors">
              <div className="flex items-center justify-between mb-5">
                <p className="font-bold text-lg text-white">{record.date}</p>
                <div className="flex items-center gap-3">
                  {getStatusBadge(record.status)}
                  {getValidationBadge(record.validationStatus)}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Punch In", value: record.punchIn?.time ? new Date(record.punchIn.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "--:--" },
                  { label: "Punch Out", value: record.punchOut?.time ? new Date(record.punchOut.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "--:--" },
                  { label: "Working Hours", value: record.workingHours ? `${record.workingHours}h` : "--" },
                  { label: "Overtime", value: record.overtimeStatus },
                ].map((item) => (
                  <div key={item.label} className="bg-[var(--color-bg-main)] p-4 rounded-xl border border-[var(--color-border-subtle)]">
                    <p className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="text-base font-bold text-white capitalize">{item.value}</p>
                  </div>
                ))}
              </div>
              {record.validationRemark && (
                <div className="mt-4 px-5 py-4 rounded-xl text-sm bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] text-white font-medium italic">
                  "{record.validationRemark}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAttendancePage;