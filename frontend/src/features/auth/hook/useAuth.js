import { useDispatch } from "react-redux";
import { setUser, setToken, setLoading, setError, logout as logoutAction } from "../store/auth.slice.js";
import { registerUser, loginUser, getUser } from "../service/auth.api.js";

export const useAuth = () => {
  const dispatch = useDispatch();

  async function handleRegister({ name, email, password, role, department, managerId }) {
    try {
      dispatch(setLoading(true));
      const response = await registerUser({ name, email, password, role, department, managerId });
      dispatch(setUser(response.data.user));
      dispatch(setToken(response.data.token));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data.user;
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
      dispatch(setUser(response.data.user));
      dispatch(setToken(response.data.token));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data.user;
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
      dispatch(setUser(response.data));
      return response.data;
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Failed to get user"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  function handleLogout() {
    dispatch(logoutAction());
  }

  return { handleRegister, handleLogin, handleGetMe, handleLogout };
};