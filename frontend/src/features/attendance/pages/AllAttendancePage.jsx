import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAttendance } from "../hook/useAttendance.js";
import { CheckCircle, XCircle, AlertCircle, Eye, X, Camera, MapPin, FileText } from "lucide-react";

const AllAttendancePage = () => {
  const { handleGetAllAttendance, handleValidateAttendance } = useAttendance();
  const { allRecords, loading } = useSelector((state) => state.attendance);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [validationStatus, setValidationStatus] = useState("valid");
  const [validationRemark, setValidationRemark] = useState("");
  const [successMsg, setSuccessMsg] = useState(null);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    handleGetAllAttendance();
  }, []);

  const handleValidate = async () => {
    try {
      await handleValidateAttendance({ id: selectedRecord._id, validationStatus, validationRemark });
      setSuccessMsg("Attendance validated successfully!");
      setSelectedRecord(null);
      setValidationRemark("");
      setTimeout(() => setSuccessMsg(null), 3000);
      handleGetAllAttendance();
    } catch (err) {}
  };

  const filtered = allRecords.filter((r) => {
    const nameMatch = (r.userId?.name || "").toLowerCase().includes(search.toLowerCase());
    const dateMatch = filterDate ? r.date === filterDate : true;
    return nameMatch && dateMatch;
  });

  const getValidationBadge = (status) => {
    if (status === "valid") return <span className="text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-[var(--color-accent-success)]/10 text-[var(--color-accent-success)] border border-[var(--color-accent-success)]/20">Valid</span>;
    if (status === "invalid") return <span className="text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-[var(--color-accent-danger)]/10 text-[var(--color-accent-danger)] border border-[var(--color-accent-danger)]/20">Invalid</span>;
    return <span className="text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-white/5 text-[var(--color-text-secondary)] border border-white/10">Pending</span>;
  };

  const getStatusBadge = (status) => {
    if (status === "completed") return <span className="text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-[var(--color-accent-success)]/10 text-[var(--color-accent-success)] border border-[var(--color-accent-success)]/20">Completed</span>;
    return <span className="text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-[var(--color-accent-warning)]/10 text-[var(--color-accent-warning)] border border-[var(--color-accent-warning)]/20">Incomplete</span>;
  };

  if (loading && allRecords.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-main)]">
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">Loading all attendance records...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-[var(--color-bg-main)]">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-wide mb-2">All Attendance</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">System-wide attendance records — validate and monitor</p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-xl mb-8 text-sm border bg-[var(--color-accent-success)]/10 border-[var(--color-accent-success)]/20 text-[var(--color-accent-success)]">
          <CheckCircle size={18} /> <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 mb-8 bg-[var(--color-bg-card)] p-4 rounded-2xl border border-[var(--color-border-subtle)] shadow-sm">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-5 py-3 rounded-xl text-sm outline-none flex-1 bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] text-white placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-primary)]/50 transition-colors"
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-5 py-3 rounded-xl text-sm outline-none bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] text-white focus:border-[var(--color-accent-primary)]/50 transition-colors"
        />
        {filterDate && (
          <button onClick={() => setFilterDate("")} className="px-5 py-3 rounded-xl text-sm font-bold transition-colors bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5">
            Clear
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="metric-card flex flex-col items-center justify-center h-64 border border-[var(--color-border-subtle)]">
          <AlertCircle size={48} className="mb-4 text-[var(--color-text-muted)] opacity-50" />
          <p className="text-base font-medium text-[var(--color-text-secondary)]">No records found matching your filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((record) => (
            <div key={record._id} className="metric-card shadow-sm border border-[var(--color-border-subtle)] hover:border-[var(--color-accent-primary)]/30 transition-colors">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg text-white bg-[var(--color-accent-primary)] ring-2 ring-[var(--color-accent-primary)]/20">
                    {(record.userId?.name || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-white mb-0.5">{record.userId?.name || "Unknown"}</p>
                    <p className="text-sm text-[var(--color-text-secondary)] font-medium flex items-center gap-2">
                        {record.userId?.email} 
                        <span className="text-[var(--color-border-subtle)]">|</span>
                        <span className="capitalize">{record.userId?.role}</span>
                        <span className="text-[var(--color-border-subtle)]">|</span>
                        {record.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(record.status)}
                  {getValidationBadge(record.validationStatus)}
                  <button
                    onClick={() => { setSelectedRecord(record); setValidationStatus("valid"); setValidationRemark(""); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border border-[var(--color-border-subtle)] bg-[var(--color-bg-main)] hover:bg-white/5 text-white"
                  >
                    <Eye size={14} /> Review
                  </button>
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

      {/* Validation Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl p-8 bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-2xl relative">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white tracking-wide">Review Attendance</h3>
              <button onClick={() => setSelectedRecord(null)} className="p-2 rounded-full hover:bg-white/10 transition-colors text-[var(--color-text-secondary)] hover:text-white"><X size={20} /></button>
            </div>

            <div className="mb-6 px-5 py-4 rounded-xl bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg text-white bg-[var(--color-accent-primary)] ring-2 ring-[var(--color-accent-primary)]/20">
                    {(selectedRecord.userId?.name || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-base font-bold text-white mb-0.5">{selectedRecord.userId?.name}</p>
                    <p className="text-sm text-[var(--color-text-secondary)] font-medium">
                        {selectedRecord.date} <span className="mx-1 text-[var(--color-border-subtle)]">|</span> <span className="capitalize">{selectedRecord.userId?.role}</span>
                    </p>
                  </div>
              </div>
              <div className="text-right">
                  <p className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Hours Worked</p>
                  <p className="text-lg font-bold text-[var(--color-accent-primary)]">{selectedRecord.workingHours}h</p>
              </div>
            </div>

            {/* Selfies */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="flex items-center gap-2 text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
                    <Camera size={14} className="text-[var(--color-accent-primary)]" /> Punch In Selfie
                </p>
                {selectedRecord.punchIn?.selfie ? (
                  <img src={selectedRecord.punchIn.selfie} alt="punch-in" className="w-full aspect-video rounded-xl object-cover border border-[var(--color-border-subtle)] shadow-sm" />
                ) : (
                  <div className="aspect-video rounded-xl flex flex-col items-center justify-center bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] opacity-70">
                      <Camera size={24} className="mb-2 text-[var(--color-text-muted)]" />
                      <span className="text-xs font-medium text-[var(--color-text-secondary)]">No selfie</span>
                  </div>
                )}
              </div>
              <div>
                <p className="flex items-center gap-2 text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
                    <Camera size={14} className="text-[var(--color-accent-warning)]" /> Punch Out Selfie
                </p>
                {selectedRecord.punchOut?.selfie ? (
                  <img src={selectedRecord.punchOut.selfie} alt="punch-out" className="w-full aspect-video rounded-xl object-cover border border-[var(--color-border-subtle)] shadow-sm" />
                ) : (
                  <div className="aspect-video rounded-xl flex flex-col items-center justify-center bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] opacity-70">
                      <Camera size={24} className="mb-2 text-[var(--color-text-muted)]" />
                      <span className="text-xs font-medium text-[var(--color-text-secondary)]">No selfie</span>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            {selectedRecord.punchIn?.location && (
              <div className="mb-6 px-5 py-4 rounded-xl text-sm bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] flex items-center gap-3 text-[var(--color-text-secondary)] font-medium">
                <MapPin size={16} className="text-[var(--color-accent-warning)]" />
                <span>Lat: <strong className="text-white">{selectedRecord.punchIn.location.lat?.toFixed(4)}</strong>, Lng: <strong className="text-white">{selectedRecord.punchIn.location.lng?.toFixed(4)}</strong></span>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">Verification Verdict</label>
              <div className="flex gap-4">
                {["valid", "invalid"].map((s) => (
                  <button key={s} onClick={() => setValidationStatus(s)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all border
                      ${validationStatus === s
                        ? s === "valid" 
                            ? "bg-[var(--color-accent-success)] border-[var(--color-accent-success)] text-white shadow-lg shadow-[var(--color-accent-success)]/20" 
                            : "bg-[var(--color-accent-danger)] border-[var(--color-accent-danger)] text-white shadow-lg shadow-[var(--color-accent-danger)]/20"
                        : "bg-[var(--color-bg-main)] border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:bg-white/5"}`}
                  >
                    {s === "valid" ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="flex items-center gap-2 text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
                <FileText size={14} className="text-[var(--color-text-muted)]" /> Reviewer Notes (Optional)
              </label>
              <textarea value={validationRemark} onChange={(e) => setValidationRemark(e.target.value)} placeholder="Add context to your decision..." rows={3}
                className="w-full px-5 py-4 rounded-xl text-sm outline-none resize-none bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] text-white placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-primary)]/50 transition-colors"
              />
            </div>

            <div className="flex gap-4 pt-6 border-t border-[var(--color-border-subtle)]">
              <button onClick={() => setSelectedRecord(null)} className="flex-1 py-4 rounded-xl text-sm font-bold transition-colors bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5">Cancel</button>
              <button onClick={handleValidate} disabled={loading} className="flex-[2] py-4 rounded-xl text-sm font-bold text-white transition-all shadow-lg active:scale-[0.98] bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-hover)] shadow-[var(--color-accent-primary)]/20 disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none">Submit Decision</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAttendancePage;