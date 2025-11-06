import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Extract error message from various possible locations
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message ||
      "Request failed";

    console.error("API Error:", message);
    if (status && status >= 400) {
      window.location.href = `/error?status=${status}&message=${encodeURIComponent(
        message
      )}`;
    }
    return Promise.reject(new Error(message));
  }
);

const apiClient = {
  get: (endpoint) => axiosInstance.get(endpoint),

  post: (endpoint, body) => axiosInstance.post(endpoint, body),

  put: (endpoint, body) => axiosInstance.put(endpoint, body),

  delete: (endpoint) => axiosInstance.delete(endpoint),
};

export default apiClient;
