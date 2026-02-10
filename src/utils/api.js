// utils/api.js
import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "https://expensetracker-xssx.onrender.com/api",
  // timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - REMOVE duplicate token logic since AuthContext handles it
api.interceptors.request.use(
  (config) => {
    // Note: AuthContext now sets default headers
    // So we don't need to add token here
    
    // For FormData, let browser set Content-Type
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.message, error.response?.status);
    
    // Handle Network/CORS errors
    if (error.message === "Network Error" || !error.response) {
      console.warn("Network/CORS Error - Check backend configuration");
      
      // Don't auto-logout on network errors
      if (error.config.url.includes("/auth/me")) {
        // For /auth/me requests, just reject but don't redirect
        return Promise.reject(error);
      }
    }
    
    // Handle 401 Unauthorized (only for non-auth endpoints)
    if (error.response?.status === 401 && !error.config.url.includes("/auth/login") && !error.config.url.includes("/auth/register")) {
      console.log("401 Unauthorized - Clearing auth data");
      
      // Clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Clear axios headers
      delete api.defaults.headers.common["Authorization"];
      delete api.defaults.headers.common["authorization"];
      
      // Redirect to login
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;