import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "";

const attendanceApiInstance = axios.create({
  baseURL: `${BASE}/attendance`,
});

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const punchInApi = async ({ selfie, location }) => {
  const response = await attendanceApiInstance.post(
    "/punch-in",
    { selfie, location },
    getAuthHeader()
  );
  return response.data;
};

export const punchOutApi = async ({ selfie, location }) => {
  const response = await attendanceApiInstance.post(
    "/punch-out",
    { selfie, location },
    getAuthHeader()
  );
  return response.data;
};

export const getMyAttendanceApi = async () => {
  const response = await attendanceApiInstance.get("/my", getAuthHeader());
  return response.data;
};

export const getTeamAttendanceApi = async () => {
  const response = await attendanceApiInstance.get("/team", getAuthHeader());
  return response.data;
};

export const getAllAttendanceApi = async () => {
  const response = await attendanceApiInstance.get("/all", getAuthHeader());
  return response.data;
};

export const validateAttendanceApi = async ({ id, validationStatus, validationRemark }) => {
  const response = await attendanceApiInstance.patch(
    `/${id}/validate`,
    { validationStatus, validationRemark },
    getAuthHeader()
  );
  return response.data;
};

export const getReportApi = async (date) => {
  const response = await attendanceApiInstance.get(
    `/report${date ? `?date=${date}` : ""}`,
    getAuthHeader()
  );
  return response.data;
};