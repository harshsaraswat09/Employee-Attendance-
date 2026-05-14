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
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    setSelfie(canvas.toDataURL("image/jpeg"));
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
    <div className="min-h-screen p-8" style={{ backgroundColor: "#0a0a0a" }}>
      <h2 className="text-2xl font-bold text-white mb-1">Attendance</h2>
      <p className="text-sm mb-6" style={{ color: "#888888" }}>
        {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      </p>

      {/* Today Status */}
      <div className="rounded-2xl p-5 mb-6" style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}>
        <p className="text-xs font-semibold mb-3" style={{ color: "#888888" }}>Today's Status</p>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Punch In", value: todayRecord?.punchIn?.time ? new Date(todayRecord.punchIn.time).toLocaleTimeString() : "--:--" },
            { label: "Punch Out", value: todayRecord?.punchOut?.time ? new Date(todayRecord.punchOut.time).toLocaleTimeString() : "--:--" },
            { label: "Working Hours", value: todayRecord?.workingHours ? `${todayRecord.workingHours}h` : "--" },
            { label: "Status", value: todayRecord?.status || "not started" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs mb-1" style={{ color: "#888888" }}>{item.label}</p>
              <p className="text-sm font-semibold text-white capitalize">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Success / Error */}
      {successMsg && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4 text-sm"
          style={{ backgroundColor: "#1a2e0a", border: "1px solid #2a4a10", color: "#c8f135" }}
        >
          <CheckCircle size={16} /> {successMsg}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4 text-sm"
          style={{ backgroundColor: "#2e0a0a", border: "1px solid #4a1010", color: "#f87171" }}
        >
          <XCircle size={16} /> {error}
        </div>
      )}

      {hasPunchedOut ? (
        <div className="rounded-2xl p-10 text-center" style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "#1a2e0a" }}
          >
            <CheckCircle size={32} style={{ color: "#c8f135" }} />
          </div>
          <p className="text-white font-semibold text-lg">Attendance completed for today!</p>
          <p className="text-sm mt-1" style={{ color: "#888888" }}>
            You worked {todayRecord.workingHours} hours today.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Camera Card */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}>
            <div className="flex items-center gap-2 mb-4">
              <Camera size={16} style={{ color: "#c8f135" }} />
              <p className="text-sm font-semibold text-white">Selfie Capture</p>
            </div>

            {cameraActive && (
              <video ref={videoRef} autoPlay playsInline
                className="w-full rounded-xl mb-3"
                style={{ border: "1px solid #2a2a2a" }}
              />
            )}
            {selfie && (
              <img src={selfie} alt="Captured"
                className="w-full rounded-xl mb-3"
                style={{ border: "1px solid #2a2a2a" }}
              />
            )}
            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-3 mt-2">
              {!cameraActive && !selfie && (
                <button onClick={startCamera}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-black transition hover:opacity-90"
                  style={{ backgroundColor: "#c8f135" }}
                >
                  <Camera size={16} /> Open Camera
                </button>
              )}
              {cameraActive && (
                <>
                  <button onClick={captureSelfie}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-black transition hover:opacity-90"
                    style={{ backgroundColor: "#c8f135" }}
                  >
                    <Camera size={16} /> Capture
                  </button>
                  <button onClick={stopCamera}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium transition"
                    style={{ backgroundColor: "#1a1a1a", color: "#888888" }}
                  >
                    Cancel
                  </button>
                </>
              )}
              {selfie && (
                <button onClick={startCamera}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium transition"
                  style={{ backgroundColor: "#1a1a1a", color: "#888888" }}
                >
                  Retake
                </button>
              )}
            </div>
          </div>

          {/* Location + Punch Card */}
          <div className="rounded-2xl p-6 flex flex-col" style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}>
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={16} style={{ color: "#c8f135" }} />
              <p className="text-sm font-semibold text-white">Location</p>
            </div>

            {location ? (
              <div className="px-4 py-3 rounded-xl text-sm mb-4"
                style={{ backgroundColor: "#1a2e0a", border: "1px solid #2a4a10", color: "#c8f135" }}
              >
                ✅ Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
              </div>
            ) : (
              <button onClick={captureLocation}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium mb-4 transition w-fit"
                style={{ backgroundColor: "#1a1a1a", color: "#888888", border: "1px solid #2a2a2a" }}
              >
                <MapPin size={16} /> Capture Location
              </button>
            )}
            {locationError && (
              <p className="text-xs mb-4" style={{ color: "#f87171" }}>{locationError}</p>
            )}

            <div className="mt-auto">
              <div className="flex items-center justify-center mb-4">
                <Fingerprint size={48} style={{ color: hasPunchedIn ? "#f87171" : "#c8f135" }} />
              </div>
              {!hasPunchedIn && (
                <button onClick={handlePunchInClick}
                  disabled={loading || !selfie || !location}
                  className="w-full py-3 rounded-xl font-semibold text-sm text-black transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#c8f135" }}
                >
                  {loading ? "Processing..." : "Punch In"}
                </button>
              )}
              {hasPunchedIn && !hasPunchedOut && (
                <button onClick={handlePunchOutClick}
                  disabled={loading || !selfie || !location}
                  className="w-full py-3 rounded-xl font-semibold text-sm text-white transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#dc2626" }}
                >
                  {loading ? "Processing..." : "Punch Out"}
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