import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "";

const overtimeApiInstance = axios.create({
  baseURL: `${BASE}/overtime`,
});

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const requestOvertimeApi = async ({ attendanceId, requestedHours, reason }) => {
  const response = await overtimeApiInstance.post(
    "/request",
    { attendanceId, requestedHours, reason },
    getAuthHeader()
  );
  return response.data;
};

export const getMyOvertimesApi = async () => {
  const response = await overtimeApiInstance.get("/my", getAuthHeader());
  return response.data;
};

export const getPendingOvertimesApi = async () => {
  const response = await overtimeApiInstance.get("/pending", getAuthHeader());
  return response.data;
};

export const reviewOvertimeApi = async ({ id, status }) => {
  const response = await overtimeApiInstance.patch(
    `/${id}/review`,
    { status },
    getAuthHeader()
  );
  return response.data;
};