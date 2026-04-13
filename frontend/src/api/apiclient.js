import axios from "axios";
import useAuthStore from "../store/AuthStore";

export const apiClient = axios.create({
  baseURL: "https://property-management-system-ht59.vercel.app",
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
