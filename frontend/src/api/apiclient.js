import axios from "axios";
import useAuthStore from "../store/AuthStore";

export const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
})

apiClient.interceptors.request.use(config => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})