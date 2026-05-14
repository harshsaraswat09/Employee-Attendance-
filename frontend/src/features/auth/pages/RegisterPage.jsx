import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Layers } from "lucide-react";
import { useAuth } from "../hook/useAuth.js";
import { useSelector } from "react-redux";
import { getManagersList } from "../../dashboard/service/user.api.js";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { handleRegister } = useAuth();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "", email: "", password: "",
    role: "employee", department: "", managerId: "",
  });
  const [managers, setManagers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await getManagersList();
        setManagers(res.data);
      } catch (err) { console.error("Failed to fetch managers", err); }
    };
    fetchManagers();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await handleRegister(formData);
      if (user.role === "employee") navigate("/dashboard/employee");
      else if (user.role === "manager") navigate("/dashboard/manager");
      else if (user.role === "admin") navigate("/dashboard/admin");
    } catch (err) {}
  };

  const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#fff",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    outline: "none",
    transition: "all 0.2s",
    caretColor: "#f97316",
    boxSizing: "border-box",
  };

  const onFocus = (e) => {
    e.target.style.border = "1px solid rgba(249,115,22,0.6)";
    e.target.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.08)";
    e.target.style.background = "rgba(255,255,255,0.07)";
  };
  const onBlur = (e) => {
    e.target.style.border = "1px solid rgba(255,255,255,0.08)";
    e.target.style.boxShadow = "none";
    e.target.style.background = "rgba(255,255,255,0.05)";
  };

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    fontWeight: 600,
    color: "#777",
    marginBottom: "5px",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  };

  const fieldGroup = { marginBottom: "12px" };

  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0e0e0e",
      position: "fixed",
      top: 0, left: 0,
      overflow: "hidden",
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Glow top-left */}
      <div style={{
        position: "absolute", top: "-100px", left: "-100px",
        width: "480px", height: "480px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(180,70,10,0.5) 0%, transparent 65%)",
        filter: "blur(70px)", pointerEvents: "none",
      }} />
      {/* Glow bottom-right */}
      <div style={{
        position: "absolute", bottom: "-100px", right: "-80px",
        width: "380px", height: "380px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(180,70,10,0.3) 0%, transparent 65%)",
        filter: "blur(70px)", pointerEvents: "none",
      }} />

      {/* Card */}
      <div style={{
        position: "relative", zIndex: 10,
        width: "100%",
        maxWidth: "420px",
        borderRadius: "16px",
        padding: "28px 28px 24px",
        background: "rgba(18,18,18,0.85)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(28px)",
        boxShadow: "0 32px 72px rgba(0,0,0,0.65)",
        boxSizing: "border-box",
      }}>

        {/* Brand + Heading row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "9px",
              background: "#f97316",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 14px rgba(249,115,22,0.4)", flexShrink: 0,
            }}>
              <Layers size={16} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: "15px", fontWeight: 700, color: "#fff", letterSpacing: "-0.2px" }}>
              Aether Flow
            </span>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "11px", color: "#555", margin: 0 }}>
              Have an account?{" "}
              <span onClick={() => navigate("/login")}
                style={{ color: "#f97316", fontWeight: 600, cursor: "pointer" }}>
                Log in
              </span>
            </p>
          </div>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: "18px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", letterSpacing: "-0.4px", margin: "0 0 4px" }}>
            Create an account
          </h1>
          <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
            Fill in your details below to get started.
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "18px" }} />

        {/* Error */}
        {error && (
          <div style={{
            marginBottom: "14px", padding: "10px 13px", borderRadius: "8px",
            fontSize: "12px", color: "#f87171", fontWeight: 500,
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)",
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ margin: 0 }}>

          {/* Full Name */}
          <div style={fieldGroup}>
            <label style={labelStyle}>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              required placeholder="John Doe"
              style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>

          {/* Email */}
          <div style={fieldGroup}>
            <label style={labelStyle}>Email address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              required placeholder="john@example.com"
              style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>

          {/* Role + Department */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={labelStyle}>Role</label>
              <select name="role" value={formData.role} onChange={handleChange} required
                style={{ ...inputStyle, cursor: "pointer" }}
                onFocus={onFocus} onBlur={onBlur}>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Department</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange}
                placeholder="e.g. Engineering"
                style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </div>
          </div>

          {/* Manager */}
          {formData.role === "employee" && (
            <div style={fieldGroup}>
              <label style={labelStyle}>Reporting Manager</label>
              <select name="managerId" value={formData.managerId} onChange={handleChange} required
                style={{ ...inputStyle, cursor: "pointer" }}
                onFocus={onFocus} onBlur={onBlur}>
                <option value="">Select Manager</option>
                {managers.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} ({m.department || "No Dept"})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Password */}
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password" value={formData.password} onChange={handleChange}
                required placeholder="••••••••••••"
                style={{ ...inputStyle, paddingRight: "42px" }}
                onFocus={onFocus} onBlur={onBlur} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "#555", cursor: "pointer",
                  display: "flex", alignItems: "center", padding: 0,
                }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            style={{
              width: "100%", padding: "12px",
              borderRadius: "9px", border: "none",
              background: "linear-gradient(135deg, #f97316 0%, #ea6c0a 100%)",
              color: "#fff", fontSize: "14px", fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.65 : 1,
              boxShadow: "0 6px 22px rgba(249,115,22,0.38)",
              transition: "all 0.2s",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = "0 8px 28px rgba(249,115,22,0.52)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 6px 22px rgba(249,115,22,0.38)"; }}
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default RegisterPage;