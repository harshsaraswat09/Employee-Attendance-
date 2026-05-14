import { useDispatch } from "react-redux";
import { setUser, setToken, setLoading, setError, logout as logoutAction } from "../store/auth.slice.js";
import { registerUser, loginUser, getUser } from "../service/auth.api.js";

export const useAuth = () => {
  const dispatch = useDispatch();

  async function handleRegister({ name, email, password, role, department, managerId }) {
    try {
      dispatch(setLoading(true));
      const response = await registerUser({ name, email, password, role, department, managerId });
      // response = { success: true, data: { token, user } }
      const { token, user } = response.data;
      dispatch(setUser(user));
      dispatch(setToken(token));
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Registration failed"));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      const response = await loginUser({ email, password });
      // response = { success: true, data: { token, user } }
      const { token, user } = response.data;
      dispatch(setUser(user));
      dispatch(setToken(token));
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Login failed"));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const response = await getUser();
      // Backend returns { success: true, data: user }
      // auth.api.js returns axios response, so response.data = { success, data: user }
      const user = response.data?.data || response.data;
      dispatch(setUser(user));
      return user;
    } catch (err) {
      // Token is invalid or expired — clear it so user is redirected to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch(setError(err.response?.data?.message || "Session expired. Please login again."));
    } finally {
      dispatch(setLoading(false));
    }
  }

  function handleLogout() {
    dispatch(logoutAction());
  }

  return { handleRegister, handleLogin, handleGetMe, handleLogout };
};