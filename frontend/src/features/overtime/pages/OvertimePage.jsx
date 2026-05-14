import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useOvertime } from "../hook/useOvertime.js";
import { useAttendance } from "../../attendance/hook/useAttendance.js";
import { Clock, CheckCircle, XCircle, AlertCircle, Timer } from "lucide-react";

const OvertimePage = () => {
  const { handleRequestOvertime, handleGetMyOvertimes } = useOvertime();
  const { handleGetMyAttendance } = useAttendance();
  const { myOvertimes, loading, error } = useSelector((state) => state.overtime);
  const { records } = useSelector((state) => state.attendance);

  const [selectedAttendanceId, setSelectedAttendanceId] = useState("");
  const [requestedHours, setRequestedHours] = useState("");
  const [reason, setReason] = useState("");
  const [successMsg, setSuccessMsg] = useState(null);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    handleGetMyOvertimes();
    handleGetMyAttendance();
  }, []);

  const eligibleRecords = records.filter(
    (r) => r.punchOut?.time && r.overtimeStatus === "none"
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!selectedAttendanceId) return setFormError("Please select an attendance record");
    if (!requestedHours || requestedHours <= 0) return setFormError("Enter valid hours");
    if (!reason.trim()) return setFormError("Reason is required");
    try {
      await handleRequestOvertime({
        attendanceId: selectedAttendanceId,
        requestedHours: Number(requestedHours),
        reason,
      });
      setSelectedAttendanceId("");
      setRequestedHours("");
      setReason("");
      setSuccessMsg("Overtime request submitted!");
      setTimeout(() => setSuccessMsg(null), 3000);
      handleGetMyOvertimes();
      handleGetMyAttendance();
    } catch (err) {}
  };

  const getStatusBadge = (status) => {
    if (status === "approved")
      return <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-[var(--color-accent-success)]/10 text-[var(--color-accent-success)] border border-[var(--color-accent-success)]/20"><CheckCircle size={12} /> Approved</span>;
    if (status === "rejected")
      return <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-[var(--color-accent-danger)]/10 text-[var(--color-accent-danger)] border border-[var(--color-accent-danger)]/20"><XCircle size={12} /> Rejected</span>;
    return <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-[var(--color-accent-warning)]/10 text-[var(--color-accent-warning)] border border-[var(--color-accent-warning)]/20"><Clock size={12} /> Pending</span>;
  };

  return (
    <div className="min-h-screen p-8 bg-[var(--color-bg-main)]">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-wide mb-2">Overtime</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">Request and track your overtime</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Request Form */}
        <div className="metric-card shadow-sm border border-[var(--color-border-subtle)] h-fit">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="p-1.5 rounded bg-[var(--color-accent-secondary)]/10">
                <Timer size={16} className="text-[var(--color-accent-secondary)]" />
            </div>
            <p className="text-base font-bold text-white tracking-wide">Request Overtime</p>
          </div>

          {successMsg && (
            <div className="flex items-center gap-3 px-5 py-4 rounded-xl mb-6 text-sm border bg-[var(--color-accent-success)]/10 border-[var(--color-accent-success)]/20 text-[var(--color-accent-success)]">
              <CheckCircle size={18} /> <span className="font-medium">{successMsg}</span>
            </div>
          )}
          {(formError || error) && (
            <div className="flex items-center gap-3 px-5 py-4 rounded-xl mb-6 text-sm border bg-[var(--color-accent-danger)]/10 border-[var(--color-accent-danger)]/20 text-[var(--color-accent-danger)]">
              <XCircle size={18} /> <span className="font-medium">{formError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                Select Attendance Date
              </label>
              <select
                value={selectedAttendanceId}
                onChange={(e) => setSelectedAttendanceId(e.target.value)}
                className="w-full px-5 py-3 rounded-xl text-sm outline-none bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] text-white focus:border-[var(--color-accent-primary)]/50 transition-colors"
              >
                <option value="">-- Select a date --</option>
                {eligibleRecords.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.date} — {r.workingHours}h worked
                  </option>
                ))}
              </select>
              {eligibleRecords.length === 0 && (
                <p className="text-xs mt-2 font-medium text-[var(--color-text-muted)]">No eligible records found</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                Requested Hours
              </label>
              <input
                type="number" min="1" max="8"
                value={requestedHours}
                onChange={(e) => setRequestedHours(e.target.value)}
                placeholder="e.g. 2"
                className="w-full px-5 py-3 rounded-xl text-sm outline-none bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] text-white placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-primary)]/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why you need overtime..."
                rows={3}
                className="w-full px-5 py-3 rounded-xl text-sm outline-none resize-none bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] text-white placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-primary)]/50 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 rounded-xl font-bold text-sm text-white transition-all shadow-lg active:scale-[0.98] bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-hover)] shadow-[var(--color-accent-primary)]/20 disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>

        {/* My Requests */}
        <div>
          <p className="text-base font-bold text-white mb-4 tracking-wide">My Requests</p>
          {myOvertimes.length === 0 ? (
            <div className="metric-card flex flex-col items-center justify-center h-48 border border-[var(--color-border-subtle)]">
              <AlertCircle size={40} className="mb-3 text-[var(--color-text-muted)] opacity-50" />
              <p className="text-sm font-medium text-[var(--color-text-secondary)]">No overtime requests yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myOvertimes.map((ot) => (
                <div key={ot._id} className="metric-card shadow-sm border border-[var(--color-border-subtle)] hover:border-[var(--color-accent-primary)]/30 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-bold text-lg text-white">{ot.attendanceId?.date || "N/A"}</p>
                    {getStatusBadge(ot.status)}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[var(--color-bg-main)] p-3 rounded-xl border border-[var(--color-border-subtle)]">
                      <p className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Requested</p>
                      <p className="text-sm font-bold text-white">{ot.requestedHours}h</p>
                    </div>
                    <div className="bg-[var(--color-bg-main)] p-3 rounded-xl border border-[var(--color-border-subtle)]">
                      <p className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Reason</p>
                      <p className="text-sm font-medium text-white truncate" title={ot.reason}>{ot.reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default OvertimePage;