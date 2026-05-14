import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "";

const userApiInstance = axios.create({
  baseURL: `${BASE}/users`,
});

export const getManagersList = async () => {
  const response = await userApiInstance.get("/managers");
  return response.data;
};

export const getUserByIdApi = async (id) => {
  const token = localStorage.getItem("token");
  const response = await userApiInstance.get(`/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getAllUsersApi = async () => {
  const token = localStorage.getItem("token");
  const response = await userApiInstance.get("/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};