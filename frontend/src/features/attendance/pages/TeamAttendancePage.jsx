import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAttendance } from "../hook/useAttendance.js";
import { CheckCircle, XCircle, AlertCircle, Eye, X } from "lucide-react";

const TeamAttendancePage = () => {
  const { handleGetTeamAttendance, handleValidateAttendance } = useAttendance();
  const { teamRecords, loading } = useSelector((state) => state.attendance);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [validationStatus, setValidationStatus] = useState("valid");
  const [validationRemark, setValidationRemark] = useState("");
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    handleGetTeamAttendance();
  }, []);

  const handleValidate = async () => {
    try {
      await handleValidateAttendance({
        id: selectedRecord._id,
        validationStatus,
        validationRemark,
      });
      setSuccessMsg("Attendance validated successfully!");
      setSelectedRecord(null);
      setValidationRemark("");
      setTimeout(() => setSuccessMsg(null), 3000);
      handleGetTeamAttendance();
    } catch (err) {}
  };

  const getValidationBadge = (status) => {
    if (status === "valid")
      return <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: "#1a2e0a", color: "#c8f135" }}>Valid</span>;
    if (status === "invalid")
      return <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: "#2e0a0a", color: "#f87171" }}>Invalid</span>;
    return <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: "#1a1a1a", color: "#888888" }}>Pending</span>;
  };

  const getStatusBadge = (status) => {
    if (status === "completed")
      return <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: "#1a2e0a", color: "#c8f135" }}>Completed</span>;
    return <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: "#2e1f0a", color: "#f59e0b" }}>Incomplete</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0a0a0a" }}>
        <p className="text-sm" style={{ color: "#888888" }}>Loading team attendance...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "#0a0a0a" }}>
      <h2 className="text-2xl font-bold text-white mb-1">Team Attendance</h2>
      <p className="text-sm mb-6" style={{ color: "#888888" }}>
        View and validate your team's attendance records
      </p>

      {/* Success */}
      {successMsg && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4 text-sm"
          style={{ backgroundColor: "#1a2e0a", border: "1px solid #2a4a10", color: "#c8f135" }}
        >
          <CheckCircle size={16} /> {successMsg}
        </div>
      )}

      {teamRecords.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 rounded-2xl"
          style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}
        >
          <AlertCircle size={40} className="mb-3" style={{ color: "#333333" }} />
          <p className="text-sm" style={{ color: "#888888" }}>No team attendance records found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {teamRecords.map((record) => (
            <div key={record._id} className="rounded-2xl p-5"
              style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-white">
                    {record.userId?.name || "Unknown"}
                  </p>
                  <p className="text-xs" style={{ color: "#888888" }}>
                    {record.userId?.email} • {record.date}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(record.status)}
                  {getValidationBadge(record.validationStatus)}
                  <button
                    onClick={() => setSelectedRecord(record)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition"
                    style={{ backgroundColor: "#1a1a1a", color: "#c8f135", border: "1px solid #2a2a2a" }}
                  >
                    <Eye size={14} /> Review
                  </button>
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

      {/* Validation Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
        >
          <div className="w-full max-w-lg rounded-2xl p-6"
            style={{ backgroundColor: "#111111", border: "1px solid #2a2a2a" }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-base font-bold text-white">Review Attendance</p>
              <button onClick={() => setSelectedRecord(null)}
                className="transition" style={{ color: "#888888" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Employee Info */}
            <div className="mb-4 px-4 py-3 rounded-xl"
              style={{ backgroundColor: "#1a1a1a" }}
            >
              <p className="text-sm font-semibold text-white">{selectedRecord.userId?.name}</p>
              <p className="text-xs" style={{ color: "#888888" }}>
                {selectedRecord.date} • {selectedRecord.workingHours}h worked
              </p>
            </div>

            {/* Selfie */}
            {selectedRecord.punchIn?.selfie && (
              <div className="mb-4">
                <p className="text-xs font-medium mb-2" style={{ color: "#888888" }}>
                  Punch In Selfie
                </p>
                <img
                  src={selectedRecord.punchIn.selfie}
                  alt="Punch in selfie"
                  className="w-full rounded-xl"
                  style={{ border: "1px solid #2a2a2a", maxHeight: "200px", objectFit: "cover" }}
                />
              </div>
            )}

            {/* Location */}
            {selectedRecord.punchIn?.location && (
              <div className="mb-4 px-4 py-3 rounded-xl text-sm"
                style={{ backgroundColor: "#1a1a1a", color: "#888888" }}
              >
                📍 Lat: {selectedRecord.punchIn.location.lat?.toFixed(4)},
                Lng: {selectedRecord.punchIn.location.lng?.toFixed(4)}
              </div>
            )}

            {/* Validation Status */}
            <div className="mb-4">
              <label className="block text-xs font-medium mb-2" style={{ color: "#888888" }}>
                Mark as
              </label>
              <div className="flex gap-3">
                {["valid", "invalid"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setValidationStatus(s)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition capitalize"
                    style={{
                      backgroundColor: validationStatus === s
                        ? s === "valid" ? "#c8f135" : "#dc2626"
                        : "#1a1a1a",
                      color: validationStatus === s
                        ? s === "valid" ? "#000000" : "#ffffff"
                        : "#888888",
                      border: "1px solid #2a2a2a",
                    }}
                  >
                    {s === "valid" ? <><CheckCircle size={14} className="inline mr-1" />Valid</> : <><XCircle size={14} className="inline mr-1" />Invalid</>}
                  </button>
                ))}
              </div>
            </div>

            {/* Remark */}
            <div className="mb-5">
              <label className="block text-xs font-medium mb-2" style={{ color: "#888888" }}>
                Remark (optional)
              </label>
              <textarea
                value={validationRemark}
                onChange={(e) => setValidationRemark(e.target.value)}
                placeholder="Add a note..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#ffffff" }}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedRecord(null)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition"
                style={{ backgroundColor: "#1a1a1a", color: "#888888", border: "1px solid #2a2a2a" }}
              >
                Cancel
              </button>
              <button
                onClick={handleValidate}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-black transition hover:opacity-90"
                style={{ backgroundColor: "#c8f135" }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamAttendancePage;