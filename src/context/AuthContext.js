import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await api.get("/auth/me");

          if (response.data.success) {
            setUser(response.data.data);
            localStorage.setItem("user", JSON.stringify(response.data.data));
          }
        } catch (error) {
          console.error("Failed to load user:", error);

          if (
            error.message !== "Network Error" &&
            error.response?.status === 401
          ) {
            logout();
          } else {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            }
          }
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Registering new user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post("/auth/register", userData);

      if (response.data.success) {
        const { token: newToken, ...user } = response.data.data;

        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(user));

        setToken(newToken);
        setUser(user);

        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        return {
          success: true,
          message: response.data.message,
          data: response.data,
        };
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error) {
      const errorMessage =
        error.response.data.message || error.message || "Registration failed";
      setError(errorMessage);

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post("/auth/login", credentials);

      if (response.data.success) {
        const { token: newToken, ...user } = response.data.data;

        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(user));

        setToken(newToken);
        setUser(user);

        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        return {
          success: true,
          message: response.data.message,
          data: response.data,
        };
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      setError(errorMessage);

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    toast.success("Logged Out Successfully")
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

    delete api.defaults.headers.common["Authorization"];
    setError(null);
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.put("/auth/profile", profileData);

      if (response.data.success) {
        const { token: newToken, ...updatedUser } = response.data.data;

        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setToken(newToken);
        setUser(updatedUser);

        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        return {
          success: true,
          message: response.data.message,
          data: response.data,
        };
      } else {
        throw new Error(response.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Update failed";
      setError(errorMessage);

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  // Update user profile picture
  const updateUserProfilePicture = (profileImageUrl) => {
    if (user) {
      const updatedUser = { ...user, profileImage: profileImageUrl };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const updateUserProfile = (updatedUserData) => {
    if (updatedUserData) {
      setUser(updatedUserData);
      localStorage.setItem("user", JSON.stringify(updatedUserData));
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    updateUserProfilePicture,
    updateUserProfile,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
