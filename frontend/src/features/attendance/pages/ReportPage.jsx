import { useState } from "react";
import { useSelector } from "react-redux";
import { useAttendance } from "../hook/useAttendance.js";
import { CheckCircle, XCircle, AlertCircle, FileText, Search, MapPin, Camera, Download, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";

const ReportPage = () => {
  const { handleGetReport } = useAttendance();
  const { report, loading } = useSelector((state) => state.attendance);
  const { user } = useSelector((state) => state.auth);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [hasFetched, setHasFetched] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const handleFetch = async () => {
    await handleGetReport(selectedDate);
    setHasFetched(true);
  };

  const handleDownloadExcel = () => {
    if (!report || report.length === 0) return;

    // Use standard CSV format
    const headers = [
      "Name",
      "Email",
      "Role",
      "Department",
      "Date",
      "Punch In",
      "Punch Out",
      "Working Hours",
      "Status",
      "Validation",
      "Latitude",
      "Longitude",
      "Remarks"
    ];

    const rows = report.map(r => [
      r.userId?.name || "Unknown",
      r.userId?.email || "N/A",
      r.userId?.role || "N/A",
      r.userId?.department || "N/A",
      r.date,
      r.punchIn?.time ? new Date(r.punchIn.time).toLocaleTimeString() : "--",
      r.punchOut?.time ? new Date(r.punchOut.time).toLocaleTimeString() : "--",
      r.workingHours || 0,
      r.status,
      r.validationStatus,
      r.punchIn?.location?.lat || "--",
      r.punchIn?.location?.lng || "--",
      r.validationRemark || ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell || "").replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    // Add BOM for Excel UTF-8 compatibility
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Attendance_Report_${selectedDate}.csv`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  const getStatusBadge = (status) => {
    if (status === "completed") return <span className="text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-[var(--color-accent-success)]/10 text-[var(--color-accent-success)] border border-[var(--color-accent-success)]/20">Completed</span>;
    return <span className="text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-[var(--color-accent-warning)]/10 text-[var(--color-accent-warning)] border border-[var(--color-accent-warning)]/20">Incomplete</span>;
  };

  const getValidationBadge = (status) => {
    if (status === "valid") return <span className="text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-[var(--color-accent-success)]/10 text-[var(--color-accent-success)] border border-[var(--color-accent-success)]/20">Valid</span>;
    if (status === "invalid") return <span className="text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-[var(--color-accent-danger)]/10 text-[var(--color-accent-danger)] border border-[var(--color-accent-danger)]/20">Invalid</span>;
    return <span className="text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-white/5 text-[var(--color-text-secondary)] border border-white/10">Pending</span>;
  };

  const totalHours = report.reduce((acc, r) => acc + (r.workingHours || 0), 0).toFixed(1);
  const completed = report.filter((r) => r.status === "completed").length;
  const invalid = report.filter((r) => r.validationStatus === "invalid").length;

  const scopeLabel = user?.role === "employee" ? "Your" : user?.role === "manager" ? "Team" : "System-wide";

  return (
    <div className="min-h-screen p-8 bg-[var(--color-bg-main)]">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-wide mb-2">Attendance Report</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">{scopeLabel} daily attendance report</p>
      </div>

      {/* Date picker + fetch */}
      <div className="flex gap-4 mb-8 items-center bg-[var(--color-bg-card)] p-4 rounded-2xl border border-[var(--color-border-subtle)] shadow-sm">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-5 py-3 rounded-xl text-sm outline-none bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] text-white focus:border-[var(--color-accent-primary)]/50 transition-colors"
        />
        <button
          onClick={handleFetch}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg active:scale-[0.98] bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-hover)] shadow-[var(--color-accent-primary)]/20 disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none"
        >
          <Search size={16} />
          {loading ? "Loading..." : "Generate Report"}
        </button>

        {hasFetched && report.length > 0 && (
          <button
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-colors bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] text-white hover:bg-white/5 ml-auto"
          >
            <Download size={16} className="text-[var(--color-accent-primary)]" />
            Export Excel
          </button>
        )}
      </div>

      {/* Stats row — shown only after fetch */}
      {hasFetched && report.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Total Records", value: report.length, color: "var(--color-accent-primary)" },
            { label: "Completed Shifts", value: `${completed}/${report.length}`, color: "var(--color-accent-success)" },
            { label: "Total Hours", value: `${totalHours}h`, color: "var(--color-accent-warning)" },
          ].map((s) => (
            <div key={s.label} className="metric-card shadow-sm border border-[var(--color-border-subtle)]">
              <p className="text-[10px] font-bold mb-3 text-[var(--color-text-secondary)] uppercase tracking-wider">{s.label}</p>
              <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Warning if invalid records */}
      {hasFetched && invalid > 0 && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-xl mb-8 text-sm border bg-[var(--color-accent-danger)]/10 border-[var(--color-accent-danger)]/20 text-[var(--color-accent-danger)]">
          <XCircle size={18} /> <span className="font-medium">{invalid} record{invalid > 1 ? "s" : ""} flagged as invalid</span>
        </div>
      )}

      {/* Empty / not yet fetched */}
      {!hasFetched && (
        <div className="metric-card flex flex-col items-center justify-center h-[300px] border border-[var(--color-border-subtle)]">
          <FileText size={48} className="mb-4 text-[var(--color-text-muted)] opacity-50" />
          <p className="text-base font-bold text-white tracking-wide mb-1">Select a date</p>
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">Pick a date and click Generate Report</p>
        </div>
      )}

      {hasFetched && report.length === 0 && (
        <div className="metric-card flex flex-col items-center justify-center h-[300px] border border-[var(--color-border-subtle)]">
          <AlertCircle size={48} className="mb-4 text-[var(--color-text-muted)] opacity-50" />
          <p className="text-base font-medium text-[var(--color-text-secondary)]">No records found for {selectedDate}</p>
        </div>
      )}

      {/* Records */}
      {hasFetched && report.length > 0 && (
        <div className="space-y-4">
          {report.map((record) => (
            <div key={record._id} className="metric-card p-0 overflow-hidden border border-[var(--color-border-subtle)] shadow-sm">
              {/* Row */}
              <div 
                className={`flex items-center justify-between p-5 cursor-pointer transition-colors hover:bg-white/5 ${expandedId === record._id ? 'bg-white/5 border-b border-[var(--color-border-subtle)]' : ''}`}
                onClick={() => setExpandedId(expandedId === record._id ? null : record._id)}
              >
                <div className="flex items-center gap-4">
                  {user?.role !== "employee" && (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg text-white bg-[var(--color-accent-primary)] ring-2 ring-[var(--color-accent-primary)]/20">
                      {(record.userId?.name || "?")[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    {user?.role !== "employee" && (
                      <p className="font-bold text-base text-white tracking-wide mb-0.5">{record.userId?.name || "Unknown"}</p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap text-sm text-[var(--color-text-secondary)]">
                      {user?.role !== "employee" && <span className="font-medium text-[var(--color-text-muted)]">{record.userId?.email} &bull; </span>}
                      <span>In: <strong className="text-white font-medium">{record.punchIn?.time ? new Date(record.punchIn.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "--:--"}</strong></span>
                      <ArrowRight size={12} className="text-[var(--color-text-muted)] mx-1" />
                      <span>Out: <strong className="text-white font-medium">{record.punchOut?.time ? new Date(record.punchOut.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "--:--"}</strong></span>
                      <span className="mx-2 text-[var(--color-border-subtle)]">|</span>
                      <span className="text-[var(--color-accent-primary)] font-bold">{record.workingHours ? `${record.workingHours}h` : "--"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(record.status)}
                  {getValidationBadge(record.validationStatus)}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)]">
                    {expandedId === record._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {expandedId === record._id && (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-[var(--color-bg-main)]/50">
                  {/* Selfie */}
                  <div>
                    <p className="flex items-center gap-2 text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
                      <Camera size={14} className="text-[var(--color-accent-primary)]" /> Punch In Selfie
                    </p>
                    {record.punchIn?.selfie ? (
                      <img src={record.punchIn.selfie} alt="selfie" className="w-full aspect-video rounded-xl object-cover border border-[var(--color-border-subtle)] shadow-sm" />
                    ) : (
                      <div className="flex flex-col items-center justify-center aspect-video rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-main)] opacity-70">
                        <Camera size={24} className="mb-2 text-[var(--color-text-muted)]" />
                        <p className="text-xs font-medium text-[var(--color-text-secondary)]">No selfie captured</p>
                      </div>
                    )}
                  </div>

                  {/* Location + meta */}
                  <div className="space-y-5">
                    <div>
                      <p className="flex items-center gap-2 text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
                        <MapPin size={14} className="text-[var(--color-accent-warning)]" /> Location
                      </p>
                      {record.punchIn?.location ? (
                        <div className="px-5 py-4 rounded-xl text-sm bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] flex flex-col gap-1 text-[var(--color-text-secondary)] font-medium">
                          <span>Lat: <strong className="text-white">{record.punchIn.location.lat?.toFixed(5)}</strong></span>
                          <span>Lng: <strong className="text-white">{record.punchIn.location.lng?.toFixed(5)}</strong></span>
                        </div>
                      ) : (
                        <div className="px-5 py-4 rounded-xl text-sm bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] font-medium">No location data</div>
                      )}
                    </div>
                    
                    {record.validationRemark && (
                      <div>
                        <p className="flex items-center gap-2 text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
                            <FileText size={14} className="text-[var(--color-accent-success)]" /> Remark
                        </p>
                        <div className="px-5 py-4 rounded-xl text-sm bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] text-white font-medium italic">
                            "{record.validationRemark}"
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="px-5 py-4 rounded-xl bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)]">
                            <p className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Department</p>
                            <p className="text-sm font-bold text-white">{record.userId?.department || "—"}</p>
                        </div>
                        <div className="px-5 py-4 rounded-xl bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)]">
                            <p className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Overtime</p>
                            <p className="text-sm font-bold text-white capitalize">{record.overtimeStatus}</p>
                        </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportPage;