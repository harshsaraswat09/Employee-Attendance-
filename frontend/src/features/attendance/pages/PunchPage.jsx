import { useRef, useState, useEffect } from "react";
import { Camera, MapPin, CheckCircle, XCircle, Fingerprint } from "lucide-react";
import { useAttendance } from "../hook/useAttendance.js";
import { useSelector } from "react-redux";

const PunchPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [selfie, setSelfie] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const { handlePunchIn, handlePunchOut, handleGetMyAttendance } = useAttendance();
  const { todayRecord, loading, error } = useSelector((state) => state.attendance);

  useEffect(() => {
    handleGetMyAttendance();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
      setSelfie(null);
    } catch (err) {
      alert("Camera access denied.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const captureSelfie = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      alert("Camera is still initializing, please wait a moment.");
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    
    // Flip canvas horizontally to match the mirrored video preview
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    
    // Use high compression to avoid large payload/broken image issues
    setSelfie(canvas.toDataURL("image/jpeg", 0.6));
    stopCamera();
  };

  const captureLocation = () => {
    setLocationError(null);
    if (!navigator.geolocation) return setLocationError("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocationError("Location access denied.")
    );
  };

  const handlePunchInClick = async () => {
    if (!selfie) return alert("Please capture a selfie first");
    if (!location) return alert("Please capture your location first");
    try {
      await handlePunchIn({ selfie, location });
      setSelfie(null);
      setLocation(null);
      setSuccessMsg("Punched in successfully!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {}
  };

  const handlePunchOutClick = async () => {
    if (!selfie) return alert("Please capture a selfie first");
    if (!location) return alert("Please capture your location first");
    try {
      await handlePunchOut({ selfie, location });
      setSelfie(null);
      setLocation(null);
      setSuccessMsg("Punched out successfully!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {}
  };

  const hasPunchedIn = !!todayRecord?.punchIn?.time;
  const hasPunchedOut = !!todayRecord?.punchOut?.time;

  return (
    <div className="min-h-screen p-8 bg-[var(--color-bg-main)]">
      <div className="mb-8">
          <h2 className="text-3xl font-bold text-white tracking-wide mb-2">Attendance</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
      </div>

      {/* Today Status */}
      <div className="metric-card shadow-sm border border-[var(--color-border-subtle)] mb-8">
        <p className="text-[10px] font-bold mb-4 text-[var(--color-text-secondary)] uppercase tracking-wider">Today's Status</p>
        
        {/* Shift Progress Bar */}
        {hasPunchedIn && !hasPunchedOut && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Shift Progress (8h Target)</span>
              <span className="text-sm font-bold text-[var(--color-accent-primary)]">
                {todayRecord.workingHours ? Math.min(100, (todayRecord.workingHours / 8 * 100)).toFixed(1) : "0"}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full overflow-hidden bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)]">
              <div 
                className="h-full transition-all duration-1000 bg-[var(--color-accent-primary)] shadow-[0_0_10px_rgba(255,87,34,0.3)]" 
                style={{ width: `${Math.min(100, (todayRecord.workingHours / 8 * 100))}%` }} 
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Punch In", value: todayRecord?.punchIn?.time ? new Date(todayRecord.punchIn.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "--:--" },
            { label: "Punch Out", value: todayRecord?.punchOut?.time ? new Date(todayRecord.punchOut.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "--:--" },
            { label: "Working Hours", value: todayRecord?.workingHours ? `${todayRecord.workingHours}h` : "--" },
            { label: "Status", value: todayRecord?.status || "not started" },
          ].map((item) => (
            <div key={item.label} className="bg-[var(--color-bg-main)] rounded-xl p-4 border border-[var(--color-border-subtle)]">
              <p className="text-[10px] font-bold mb-1.5 text-[var(--color-text-muted)] uppercase tracking-wider">{item.label}</p>
              <p className="text-lg font-bold text-white capitalize">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Success / Error */}
      {successMsg && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-xl mb-6 text-sm border bg-[var(--color-accent-success)]/10 border-[var(--color-accent-success)]/20 text-[var(--color-accent-success)]">
          <CheckCircle size={18} /> <span className="font-medium">{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-xl mb-6 text-sm border bg-[var(--color-accent-danger)]/10 border-[var(--color-accent-danger)]/20 text-[var(--color-accent-danger)]">
          <XCircle size={18} /> <span className="font-medium">{error}</span>
        </div>
      )}

      {hasPunchedOut ? (
        <div className="metric-card p-12 text-center flex flex-col items-center shadow-sm border border-[var(--color-border-subtle)]">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-[var(--color-accent-success)]/10 ring-4 ring-[var(--color-accent-success)]/5">
            <CheckCircle size={40} className="text-[var(--color-accent-success)]" />
          </div>
          <p className="text-white font-bold text-2xl mb-2">Attendance completed for today!</p>
          <p className="text-base text-[var(--color-text-secondary)]">
            You worked <strong className="text-white">{todayRecord.workingHours}</strong> hours today.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Camera Card */}
          <div className="metric-card shadow-sm border border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-1.5 rounded bg-[var(--color-accent-secondary)]/10">
                <Camera size={16} className="text-[var(--color-accent-secondary)]" />
              </div>
              <p className="text-base font-bold text-white tracking-wide">Selfie Capture</p>
            </div>

            <div className="aspect-video bg-[var(--color-bg-main)] rounded-xl border border-[var(--color-border-subtle)] flex items-center justify-center overflow-hidden mb-5">
                <video ref={videoRef} autoPlay playsInline
                    className={`w-full h-full object-cover -scale-x-100 ${cameraActive ? "block" : "hidden"}`}
                />
                {selfie && !cameraActive && (
                <img src={selfie} alt="Captured"
                    className="w-full h-full object-cover"
                />
                )}
                {!cameraActive && !selfie && (
                    <Camera size={32} className="text-[var(--color-text-muted)] opacity-50" />
                )}
                <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="flex gap-3">
              {!cameraActive && !selfie && (
                <button onClick={startCamera}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-[var(--color-accent-secondary)]/20 active:scale-[0.98] bg-[var(--color-accent-secondary)] hover:bg-[#4f46e5]"
                >
                  <Camera size={18} /> Open Camera
                </button>
              )}
              {cameraActive && (
                <>
                  <button onClick={captureSelfie}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-[var(--color-accent-secondary)]/20 active:scale-[0.98] bg-[var(--color-accent-secondary)] hover:bg-[#4f46e5]"
                  >
                    <Camera size={18} /> Capture
                  </button>
                  <button onClick={stopCamera}
                    className="px-6 py-3.5 rounded-xl text-sm font-bold transition-colors bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5"
                  >
                    Cancel
                  </button>
                </>
              )}
              {selfie && (
                <button onClick={startCamera}
                  className="w-full px-4 py-3.5 rounded-xl text-sm font-bold transition-colors bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5"
                >
                  Retake Selfie
                </button>
              )}
            </div>
          </div>

          {/* Location + Punch Card */}
          <div className="metric-card flex flex-col shadow-sm border border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-1.5 rounded bg-[var(--color-accent-warning)]/10">
                 <MapPin size={16} className="text-[var(--color-accent-warning)]" />
              </div>
              <p className="text-base font-bold text-white tracking-wide">Location Verification</p>
            </div>

            {location ? (
              <div className="px-5 py-4 rounded-xl text-sm mb-6 flex items-center gap-3 bg-[var(--color-accent-success)]/10 border border-[var(--color-accent-success)]/20 text-[var(--color-accent-success)]">
                <CheckCircle size={18} /> 
                <span className="font-medium">Verified: Lat {location.lat.toFixed(4)}, Lng {location.lng.toFixed(4)}</span>
              </div>
            ) : (
              <button onClick={captureLocation}
                className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl text-sm font-bold mb-6 transition-colors bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5"
              >
                <MapPin size={18} /> Detect Location
              </button>
            )}
            {locationError && (
              <p className="text-xs mb-6 font-medium text-[var(--color-accent-danger)]">{locationError}</p>
            )}

            <div className="mt-auto bg-[var(--color-bg-main)] rounded-2xl p-6 border border-[var(--color-border-subtle)] flex flex-col items-center">
              <div className="flex items-center justify-center mb-6">
                <Fingerprint size={56} className={hasPunchedIn ? "text-[var(--color-accent-danger)]" : "text-[var(--color-accent-primary)]"} />
              </div>
              {!hasPunchedIn && (
                <button onClick={handlePunchInClick}
                  disabled={loading || !selfie || !location}
                  className="w-full py-4 rounded-xl font-bold text-sm text-white transition-all shadow-lg active:scale-[0.98] bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-hover)] shadow-[var(--color-accent-primary)]/20 disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none"
                >
                  {loading ? "Processing..." : "PUNCH IN NOW"}
                </button>
              )}
              {hasPunchedIn && !hasPunchedOut && (
                <button onClick={handlePunchOutClick}
                  disabled={loading || !selfie || !location}
                  className="w-full py-4 rounded-xl font-bold text-sm text-white transition-all shadow-lg active:scale-[0.98] bg-[var(--color-accent-danger)] hover:bg-red-600 shadow-[var(--color-accent-danger)]/20 disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none"
                >
                  {loading ? "Processing..." : "PUNCH OUT NOW"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PunchPage;