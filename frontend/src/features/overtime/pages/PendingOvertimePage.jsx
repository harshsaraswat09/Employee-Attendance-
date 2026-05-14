import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useOvertime } from "../hook/useOvertime.js";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  X,
  Timer,
  Calendar,
  Hourglass,
  FileText
} from "lucide-react";

const PendingOvertimePage = () => {
  const { handleGetPendingOvertimes, handleReviewOvertime } = useOvertime();
  const { pendingOvertimes, loading } = useSelector((state) => state.overtime);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewStatus, setReviewStatus] = useState("approved");
  const [successMsg, setSuccessMsg] = useState(null);
  const [reviewError, setReviewError] = useState(null);

  useEffect(() => {
    handleGetPendingOvertimes();
  }, []);

  const handleReview = async () => {
    setReviewError(null);
    try {
      await handleReviewOvertime({ id: selectedRequest._id, status: reviewStatus });
      setSuccessMsg(
        `Overtime request ${reviewStatus === "approved" ? "approved" : "rejected"} successfully!`
      );
      setSelectedRequest(null);
      setReviewStatus("approved");
      setTimeout(() => setSuccessMsg(null), 3000);
      handleGetPendingOvertimes();
    } catch (err) {
      setReviewError("Failed to submit review. Please try again.");
    }
  };

  const getStatusBadge = (status) => {
    if (status === "approved")
      return (
        <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-[var(--color-accent-success)]/10 text-[var(--color-accent-success)] border border-[var(--color-accent-success)]/20">
          <CheckCircle size={12} /> Approved
        </span>
      );
    if (status === "rejected")
      return (
        <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-[var(--color-accent-danger)]/10 text-[var(--color-accent-danger)] border border-[var(--color-accent-danger)]/20">
          <XCircle size={12} /> Rejected
        </span>
      );
    return (
      <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-[var(--color-accent-warning)]/10 text-[var(--color-accent-warning)] border border-[var(--color-accent-warning)]/20">
        <Clock size={12} /> Pending
      </span>
    );
  };

  if (loading && pendingOvertimes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-main)]">
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">Loading pending overtime requests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-[var(--color-bg-main)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-wide mb-2">Pending Overtime</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Review and approve your team's overtime requests
          </p>
        </div>
        <div className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-[var(--color-accent-warning)]/10 text-[var(--color-accent-warning)] border border-[var(--color-accent-warning)]/20">
          <Timer size={18} />
          {pendingOvertimes.length} Pending
        </div>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-xl mb-8 text-sm border bg-[var(--color-accent-success)]/10 border-[var(--color-accent-success)]/20 text-[var(--color-accent-success)]">
          <CheckCircle size={18} /> <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {/* Empty State */}
      {pendingOvertimes.length === 0 ? (
        <div className="metric-card flex flex-col items-center justify-center h-64 border border-[var(--color-border-subtle)]">
          <AlertCircle size={48} className="mb-4 text-[var(--color-text-muted)] opacity-50" />
          <p className="text-base font-bold text-white tracking-wide mb-1">All caught up!</p>
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">No pending overtime requests from your team</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingOvertimes.map((ot) => (
            <div key={ot._id} className="metric-card shadow-sm border border-[var(--color-border-subtle)] hover:border-[var(--color-accent-primary)]/30 transition-colors">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg text-white bg-[var(--color-accent-primary)] ring-2 ring-[var(--color-accent-primary)]/20">
                    {(ot.userId?.name || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-white mb-0.5">
                      {ot.userId?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)] font-medium">
                      {ot.userId?.email || "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(ot.status)}
                  <button
                    onClick={() => {
                      setSelectedRequest(ot);
                      setReviewStatus("approved");
                      setReviewError(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border border-[var(--color-border-subtle)] bg-[var(--color-bg-main)] hover:bg-white/5 text-white"
                  >
                    <Eye size={14} /> Review
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {[
                  {
                    icon: <Calendar size={14} className="text-[var(--color-accent-primary)]" />,
                    label: "Date",
                    value: ot.attendanceId?.date || "N/A",
                  },
                  {
                    icon: <Hourglass size={14} className="text-[var(--color-accent-warning)]" />,
                    label: "Requested Hours",
                    value: <span className="text-[var(--color-accent-warning)]">{ot.requestedHours}h</span>,
                  },
                  {
                    icon: <Clock size={14} className="text-[var(--color-accent-success)]" />,
                    label: "Working Hours",
                    value: ot.attendanceId?.workingHours
                      ? `${ot.attendanceId.workingHours}h`
                      : "—",
                  },
                ].map((item) => (
                  <div key={item.label} className="bg-[var(--color-bg-main)] p-4 rounded-xl border border-[var(--color-border-subtle)]">
                    <p className="flex items-center gap-2 text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                      {item.icon} {item.label}
                    </p>
                    <p className="text-base font-bold text-white">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="px-5 py-4 rounded-xl text-sm bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] flex items-start gap-3">
                 <FileText size={16} className="text-[var(--color-text-muted)] mt-0.5 flex-shrink-0" />
                 <div>
                    <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">Reason provided</span>
                    <span className="text-white font-medium italic">"{ot.reason}"</span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl p-8 bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white tracking-wide">Review Overtime Request</h3>
              <button onClick={() => setSelectedRequest(null)} className="p-2 rounded-full hover:bg-white/10 transition-colors text-[var(--color-text-secondary)] hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Employee Info */}
            <div className="mb-6 px-5 py-4 rounded-xl bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl text-white bg-[var(--color-accent-primary)] ring-2 ring-[var(--color-accent-primary)]/20">
                {(selectedRequest.userId?.name || "?")[0].toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-bold text-white mb-0.5">
                  {selectedRequest.userId?.name || "Unknown"}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] font-medium">
                  {selectedRequest.userId?.email}
                </p>
              </div>
            </div>

            {/* Request Details */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Date", value: selectedRequest.attendanceId?.date || "N/A" },
                {
                  label: "Hours Worked",
                  value: selectedRequest.attendanceId?.workingHours
                    ? `${selectedRequest.attendanceId.workingHours}h`
                    : "—",
                },
                { label: "OT Requested", value: <span className="text-[var(--color-accent-warning)]">{selectedRequest.requestedHours}h</span> },
              ].map((item) => (
                <div key={item.label} className="bg-[var(--color-bg-main)] p-4 rounded-xl border border-[var(--color-border-subtle)] flex flex-col justify-center items-center text-center">
                  <p className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">
                    {item.label}
                  </p>
                  <p className="text-lg font-bold text-white">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Reason */}
            <div className="mb-8 px-5 py-4 rounded-xl text-sm bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] flex items-start gap-3">
                 <FileText size={16} className="text-[var(--color-text-muted)] mt-0.5 flex-shrink-0" />
                 <div>
                    <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">Reason provided</span>
                    <span className="text-white font-medium italic">"{selectedRequest.reason}"</span>
                 </div>
            </div>

            {/* Decision Buttons */}
            <div className="mb-8">
              <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
                Decision
              </label>
              <div className="flex gap-4">
                {["approved", "rejected"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setReviewStatus(s)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all border
                      ${reviewStatus === s
                        ? s === "approved" 
                            ? "bg-[var(--color-accent-success)] border-[var(--color-accent-success)] text-white shadow-lg shadow-[var(--color-accent-success)]/20" 
                            : "bg-[var(--color-accent-danger)] border-[var(--color-accent-danger)] text-white shadow-lg shadow-[var(--color-accent-danger)]/20"
                        : "bg-[var(--color-bg-main)] border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:bg-white/5"}`}
                  >
                    {s === "approved" ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {reviewError && (
              <div className="flex items-center gap-3 px-5 py-4 rounded-xl mb-6 text-sm border bg-[var(--color-accent-danger)]/10 border-[var(--color-accent-danger)]/20 text-[var(--color-accent-danger)]">
                <XCircle size={18} /> <span className="font-medium">{reviewError}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-[var(--color-border-subtle)]">
              <button
                onClick={() => setSelectedRequest(null)}
                className="flex-1 py-4 rounded-xl text-sm font-bold transition-colors bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleReview}
                disabled={loading}
                className={`flex-[2] py-4 rounded-xl text-sm font-bold text-white transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none
                    ${reviewStatus === "approved" 
                        ? "bg-[var(--color-accent-success)] hover:bg-green-600 shadow-[var(--color-accent-success)]/20" 
                        : "bg-[var(--color-accent-danger)] hover:bg-red-600 shadow-[var(--color-accent-danger)]/20"}`}
              >
                {loading ? "Submitting..." : `Confirm ${reviewStatus === "approved" ? "Approval" : "Rejection"}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingOvertimePage;