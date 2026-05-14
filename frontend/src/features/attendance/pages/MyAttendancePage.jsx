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
        <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
          style={{ backgroundColor: "#1a2e0a", color: "#c8f135" }}
        >
          <CheckCircle size={12} /> Completed
        </span>
      );
    return (
      <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
        style={{ backgroundColor: "#2e1f0a", color: "#f59e0b" }}
      >
        <Clock size={12} /> Incomplete
      </span>
    );
  };

  const getValidationBadge = (status) => {
    if (status === "valid")
      return <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: "#1a2e0a", color: "#c8f135" }}>Valid</span>;
    if (status === "invalid")
      return <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: "#2e0a0a", color: "#f87171" }}>Invalid</span>;
    return <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: "#1a1a1a", color: "#888888" }}>Pending</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0a0a0a" }}>
        <p className="text-sm" style={{ color: "#888888" }}>Loading attendance...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "#0a0a0a" }}>
      <h2 className="text-2xl font-bold text-white mb-1">My Attendance</h2>
      <p className="text-sm mb-6" style={{ color: "#888888" }}>Your personal attendance history</p>

      {records.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 rounded-2xl"
          style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}
        >
          <AlertCircle size={40} className="mb-3" style={{ color: "#333333" }} />
          <p className="text-sm" style={{ color: "#888888" }}>No attendance records found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <div key={record._id} className="rounded-2xl p-5"
              style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-white">{record.date}</p>
                <div className="flex items-center gap-2">
                  {getStatusBadge(record.status)}
                  {getValidationBadge(record.validationStatus)}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Punch In", value: record.punchIn?.time ? new Date(record.punchIn.time).toLocaleTimeString() : "--" },
                  { label: "Punch Out", value: record.punchOut?.time ? new Date(record.punchOut.time).toLocaleTimeString() : "--" },
                  { label: "Working Hours", value: record.workingHours ? `${record.workingHours}h` : "--" },
                  { label: "Overtime", value: record.overtimeStatus },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs mb-1" style={{ color: "#888888" }}>{item.label}</p>
                    <p className="text-sm font-medium text-white capitalize">{item.value}</p>
                  </div>
                ))}
              </div>
              {record.validationRemark && (
                <div className="mt-3 px-4 py-2 rounded-xl text-xs"
                  style={{ backgroundColor: "#1a1a1a", color: "#888888" }}
                >
                  Remark: {record.validationRemark}
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