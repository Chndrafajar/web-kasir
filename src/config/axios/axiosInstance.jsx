import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API,
  headers: {
    "Content-Type": "application/json",
  },
});

// Set default headers for axiosInstance
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")).token : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
