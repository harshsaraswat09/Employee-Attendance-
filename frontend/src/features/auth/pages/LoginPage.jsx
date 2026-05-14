import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Layers } from "lucide-react";
import { useAuth } from "../hook/useAuth.js";
import { useSelector } from "react-redux";

const LoginPage = () => {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await handleLogin({ email, password });
      if (user.role === "employee") navigate("/dashboard/employee");
      else if (user.role === "manager") navigate("/dashboard/manager");
      else if (user.role === "admin") navigate("/dashboard/admin");
    } catch (err) {}
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 18px",
    borderRadius: "12px",
    fontSize: "15px",
    color: "#fff",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    outline: "none",
    transition: "all 0.2s",
  };

  const onFocus = (e) => {
    e.target.style.border = "1px solid rgba(249,115,22,0.55)";
    e.target.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.1)";
    e.target.style.background = "rgba(255,255,255,0.08)";
  };
  const onBlur = (e) => {
    e.target.style.border = "1px solid rgba(255,255,255,0.08)";
    e.target.style.boxShadow = "none";
    e.target.style.background = "rgba(255,255,255,0.06)";
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0e0e0e",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* Glow top-left */}
      <div style={{
        position: "absolute", top: "-80px", left: "-80px",
        width: "500px", height: "500px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(180,70,10,0.55) 0%, transparent 65%)",
        filter: "blur(70px)", pointerEvents: "none",
      }} />
      {/* Glow bottom-right */}
      <div style={{
        position: "absolute", bottom: "-100px", right: "-60px",
        width: "420px", height: "420px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(180,70,10,0.35) 0%, transparent 65%)",
        filter: "blur(70px)", pointerEvents: "none",
      }} />

      {/* Card */}
      <div style={{
        position: "relative", zIndex: 10,
        width: "100%", maxWidth: "420px",
        margin: "0 16px",
        borderRadius: "20px",
        padding: "40px 40px 36px",
        background: "rgba(18,18,18,0.82)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(28px)",
        boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
      }}>

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
          <div style={{
            width: "38px", height: "38px", borderRadius: "10px",
            background: "#f97316",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(249,115,22,0.45)",
            flexShrink: 0,
          }}>
            <Layers size={18} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: "17px", fontWeight: 700, color: "#fff", letterSpacing: "-0.2px" }}>
            Aether Flow
          </span>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#fff", letterSpacing: "-0.5px", marginBottom: "8px" }}>
            Welcome Back!
          </h1>
          <p style={{ fontSize: "14px", color: "#888", lineHeight: 1.6 }}>
            Sign in to your account to continue.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            marginBottom: "20px", padding: "12px 16px", borderRadius: "10px",
            fontSize: "13px", color: "#f87171", fontWeight: 500,
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#999", marginBottom: "10px", letterSpacing: "0.04em" }}>
              Email address
            </label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              required placeholder="hello@example.com"
              style={{ ...inputStyle, caretColor: "#f97316" }}
              onFocus={onFocus} onBlur={onBlur}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#999", letterSpacing: "0.04em" }}>
                Password
              </label>
              {/* <span style={{ fontSize: "13px", color: "#f97316", cursor: "pointer", fontWeight: 500 }}>
                Forget Password ?
              </span> */}
            </div>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password} onChange={(e) => setPassword(e.target.value)}
                required placeholder="••••••••••••"
                style={{ ...inputStyle, paddingRight: "48px", caretColor: "#f97316" }}
                onFocus={onFocus} onBlur={onBlur}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "#666", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: 0,
                }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Login btn */}
          <button type="submit" disabled={loading}
            style={{
              width: "100%", padding: "15px",
              borderRadius: "12px", border: "none",
              background: "linear-gradient(135deg, #f97316 0%, #ea6c0a 100%)",
              color: "#fff", fontSize: "15px", fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.65 : 1,
              marginTop: "20px", marginBottom: "20px",
              boxShadow: "0 8px 28px rgba(249,115,22,0.4)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = "0 10px 32px rgba(249,115,22,0.55)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(249,115,22,0.4)"; }}
          >
            {loading ? "Signing in..." : "Login in"}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
            <span style={{ fontSize: "13px", color: "#555", whiteSpace: "nowrap" }}>or continue with</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
          </div>

          {/* Google */}
          <button type="button"
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              padding: "13px", borderRadius: "12px", marginBottom: "10px",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              color: "#ccc", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.09)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          >
            <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, flexShrink: 0 }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.38-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          {/* Apple */}
          {/* <button type="button"
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              padding: "13px", borderRadius: "12px", marginBottom: "24px",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              color: "#ccc", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.09)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          >
            <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, flexShrink: 0 }} fill="white">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Sign in with Apple
          </button> */}

          {/* Sign up */}
          <p style={{ textAlign: "center", fontSize: "13px", color: "#666" }}>
            New here?{" "}
            <span onClick={() => navigate("/register")}
              style={{ color: "#f97316", fontWeight: 600, cursor: "pointer" }}>
              Create an account
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;