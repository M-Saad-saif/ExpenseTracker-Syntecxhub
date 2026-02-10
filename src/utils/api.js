import axios from "axios";

const api = axios.create({
  baseURL: "https://expensetracker-xssx.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.message, error.response?.status);

    if (error.message === "Network Error" || !error.response) {
      console.warn("Network/CORS Error - Check backend configuration");

      if (error.config.url.includes("/auth/me")) {
        return Promise.reject(error);
      }
    }

    if (
      error.response?.status === 401 &&
      !error.config.url.includes("/auth/login") &&
      !error.config.url.includes("/auth/register")
    ) {
      console.log("401 Unauthorized - Clearing auth data");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      delete api.defaults.headers.common["Authorization"];

      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
