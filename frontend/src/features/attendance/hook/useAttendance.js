import { useDispatch } from "react-redux";
import {
  setRecords,
  setTodayRecord,
  setTeamRecords,
  setAllRecords,
  setReport,
  setLoading,
  setError,
} from "../store/attendance.slice.js";
import {
  punchInApi,
  punchOutApi,
  getMyAttendanceApi,
  getTeamAttendanceApi,
  getAllAttendanceApi,
  validateAttendanceApi,
  getReportApi,
} from "../service/attendance.api.js";

export const useAttendance = () => {
  const dispatch = useDispatch();

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  async function handlePunchIn({ selfie, location }) {
    try {
      dispatch(setLoading(true));
      const response = await punchInApi({ selfie, location });
      dispatch(setTodayRecord(response.data));
      return response.data;
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Punch in failed"));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handlePunchOut({ selfie, location }) {
    try {
      dispatch(setLoading(true));
      const response = await punchOutApi({ selfie, location });
      dispatch(setTodayRecord(response.data));
      return response.data;
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Punch out failed"));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMyAttendance() {
    try {
      dispatch(setLoading(true));
      const response = await getMyAttendanceApi();
      const today = getTodayDate();
      const todayRecord = response.data.find((r) => r.date === today) || null;
      dispatch(setRecords(response.data));
      dispatch(setTodayRecord(todayRecord));
      return response.data;
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Failed to fetch attendance"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetTeamAttendance() {
    try {
      dispatch(setLoading(true));
      const response = await getTeamAttendanceApi();
      dispatch(setTeamRecords(response.data));
      return response.data;
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Failed to fetch team attendance"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetAllAttendance() {
    try {
      dispatch(setLoading(true));
      const response = await getAllAttendanceApi();
      dispatch(setAllRecords(response.data));
      return response.data;
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Failed to fetch all attendance"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleValidateAttendance({ id, validationStatus, validationRemark }) {
    try {
      dispatch(setLoading(true));
      const response = await validateAttendanceApi({ id, validationStatus, validationRemark });
      return response.data;
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Validation failed"));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetReport(date) {
    try {
      dispatch(setLoading(true));
      const response = await getReportApi(date);
      dispatch(setReport(response.data));
      return response.data;
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Failed to fetch report"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    handlePunchIn,
    handlePunchOut,
    handleGetMyAttendance,
    handleGetTeamAttendance,
    handleGetAllAttendance,
    handleValidateAttendance,
    handleGetReport,
  };
};