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
      return <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: "#1a2e0a", color: "#c8f135" }}><CheckCircle size={12} /> Approved</span>;
    if (status === "rejected")
      return <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: "#2e0a0a", color: "#f87171" }}><XCircle size={12} /> Rejected</span>;
    return <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: "#2e1f0a", color: "#f59e0b" }}><Clock size={12} /> Pending</span>;
  };

  const inputStyle = {
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    color: "#ffffff",
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "#0a0a0a" }}>
      <h2 className="text-2xl font-bold text-white mb-1">Overtime</h2>
      <p className="text-sm mb-6" style={{ color: "#888888" }}>Request and track your overtime</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Request Form */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}>
          <div className="flex items-center gap-2 mb-5">
            <Timer size={16} style={{ color: "#c8f135" }} />
            <p className="text-sm font-semibold text-white">Request Overtime</p>
          </div>

          {successMsg && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4 text-sm"
              style={{ backgroundColor: "#1a2e0a", border: "1px solid #2a4a10", color: "#c8f135" }}
            >
              <CheckCircle size={16} /> {successMsg}
            </div>
          )}
          {(formError || error) && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4 text-sm"
              style={{ backgroundColor: "#2e0a0a", border: "1px solid #4a1010", color: "#f87171" }}
            >
              <XCircle size={16} /> {formError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "#888888" }}>
                Select Attendance Date
              </label>
              <select
                value={selectedAttendanceId}
                onChange={(e) => setSelectedAttendanceId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={inputStyle}
              >
                <option value="">-- Select a date --</option>
                {eligibleRecords.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.date} — {r.workingHours}h worked
                  </option>
                ))}
              </select>
              {eligibleRecords.length === 0 && (
                <p className="text-xs mt-1" style={{ color: "#555555" }}>No eligible records found</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "#888888" }}>
                Requested Hours
              </label>
              <input
                type="number" min="1" max="8"
                value={requestedHours}
                onChange={(e) => setRequestedHours(e.target.value)}
                placeholder="e.g. 2"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={inputStyle}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "#888888" }}>
                Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why you need overtime..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm text-black transition hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: "#c8f135" }}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>

        {/* My Requests */}
        <div>
          <p className="text-sm font-semibold text-white mb-3">My Requests</p>
          {myOvertimes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 rounded-2xl"
              style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}
            >
              <AlertCircle size={32} className="mb-2" style={{ color: "#333333" }} />
              <p className="text-sm" style={{ color: "#888888" }}>No overtime requests yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myOvertimes.map((ot) => (
                <div key={ot._id} className="rounded-2xl p-5"
                  style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-white">{ot.attendanceId?.date || "N/A"}</p>
                    {getStatusBadge(ot.status)}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs mb-1" style={{ color: "#888888" }}>Requested Hours</p>
                      <p className="text-sm font-medium text-white">{ot.requestedHours}h</p>
                    </div>
                    <div>
                      <p className="text-xs mb-1" style={{ color: "#888888" }}>Reason</p>
                      <p className="text-sm font-medium text-white">{ot.reason}</p>
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