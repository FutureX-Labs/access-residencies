import axios from "axios";
const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token") || null;
  if (token) config.headers.Authorization = token;
  return config;
});
export default axiosInstance;
