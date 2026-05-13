import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage.jsx";
import RegisterPage from "../features/auth/pages/RegisterPage.jsx";
import ProtectedRoute from "../features/auth/components/ProtectedRoute.jsx";
import EmployeeDashboard from "../features/dashboard/pages/EmployeeDashboard.jsx";
import ManagerDashboard from "../features/dashboard/pages/ManagerDashboard.jsx";
import AdminDashboard from "../features/dashboard/pages/AdminDashboard.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
        <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
        <Route path="/dashboard/manager" element={<ManagerDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;