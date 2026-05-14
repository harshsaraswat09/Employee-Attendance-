import { useDispatch } from "react-redux";
import {
  setMyOvertimes,
  setPendingOvertimes,
  setLoading,
  setError,
} from "../store/overtime.slice.js";
import {
  requestOvertimeApi,
  getMyOvertimesApi,
  getPendingOvertimesApi,
  reviewOvertimeApi,
} from "../service/overtime.api.js";

export const useOvertime = () => {
  const dispatch = useDispatch();

  async function handleRequestOvertime({ attendanceId, requestedHours, reason }) {
    try {
      dispatch(setLoading(true));
      const response = await requestOvertimeApi({ attendanceId, requestedHours, reason });
      return response.data;
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Overtime request failed"));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMyOvertimes() {
    try {
      dispatch(setLoading(true));
      const response = await getMyOvertimesApi();
      dispatch(setMyOvertimes(response.data));
      return response.data;
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Failed to fetch overtimes"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetPendingOvertimes() {
    try {
      dispatch(setLoading(true));
      const response = await getPendingOvertimesApi();
      dispatch(setPendingOvertimes(response.data));
      return response.data;
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Failed to fetch pending overtimes"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleReviewOvertime({ id, status }) {
    try {
      dispatch(setLoading(true));
      const response = await reviewOvertimeApi({ id, status });
      return response.data;
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Review failed"));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    handleRequestOvertime,
    handleGetMyOvertimes,
    handleGetPendingOvertimes,
    handleReviewOvertime,
  };
};