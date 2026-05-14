import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Asterisk } from "lucide-react";
import { useAuth } from "../hook/useAuth.js";
import { useSelector } from "react-redux";
import "./RegisterPage.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { handleRegister } = useAuth();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    department: "",
    managerId: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await handleRegister(formData);
      if (user.role === "employee") navigate("/dashboard/employee");
      else if (user.role === "manager") navigate("/dashboard/manager");
      else if (user.role === "admin") navigate("/dashboard/admin");
    } catch (err) {
      // error handled in slice
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-card">
        {/* Left Panel */}
        <div className="register-left-panel">
          <div className="asterisk-logo">
            <Asterisk size={48} strokeWidth={3} />
          </div>
          <div className="register-left-text">
            <p className="sub">Join our community</p>
            <h2>Empower your workforce with modern attendance tracking</h2>
          </div>
        </div>

        {/* Right Panel */}
        <div className="register-right-panel">
          <div className="brand-icon-mobile">
            <Asterisk size={32} strokeWidth={3} />
          </div>

          <div className="register-header">
            <h1>Create an account</h1>
            <p>
              Get started by creating your account. Please fill in your details
              below to join our platform.
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Your email</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Role</label>
                <div className="input-wrapper">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Department</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Engineering"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="register-btn">
              {loading ? "Creating account..." : "Sign up"}
            </button>

            <p className="login-text">
              Already have an account?{" "}
              <span onClick={() => navigate("/login")}>Log in</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;