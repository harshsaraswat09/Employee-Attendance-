import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "";

const userApiInstance = axios.create({
  baseURL: `${BASE}/users`,
});

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getAllUsersApi = async () => {
  const response = await userApiInstance.get("/", getAuthHeader());
  return response.data;
};

export const getUserByIdApi = async (id) => {
  const response = await userApiInstance.get(`/${id}`, getAuthHeader());
  return response.data;
};