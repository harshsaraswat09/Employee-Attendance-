import { useDispatch } from "react-redux";
import { setUsers, setLoading, setError } from "../store/user.slice.js";
import { getAllUsersApi, getUserByIdApi } from "../service/user.api.js";

export const useUser = () => {
  const dispatch = useDispatch();

  async function handleGetAllUsers() {
    try {
      dispatch(setLoading(true));
      const response = await getAllUsersApi();
      dispatch(setUsers(response.data));
      return response.data;
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Failed to fetch users"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetUserById(id) {
    try {
      dispatch(setLoading(true));
      const response = await getUserByIdApi(id);
      return response.data;
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Failed to fetch user"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  return { handleGetAllUsers, handleGetUserById };
};