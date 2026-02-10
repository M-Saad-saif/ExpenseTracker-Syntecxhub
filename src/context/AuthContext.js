import React, { createContext, useState, useContext, useEffect } from "react";
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

  // Load user data on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await api.get("/auth/me");
          setUser(response.data.data);
        } catch (error) {
          console.error("Failed to load user:", error);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Register new user
  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      const { token: newToken, ...user } = response.data.data;

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(user));
      setToken(newToken);
      setUser(user);

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  //  Login user
  const login = async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const { token: newToken, ...user } = response.data.data;

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(user));
      setToken(newToken);
      setUser(user);

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  //  Logout user
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  
  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await api.put("/auth/profile", profileData);
      const { token: newToken, ...updatedUser } = response.data.data;

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setToken(newToken);
      setUser(updatedUser);

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Update failed",
      };
    }
  };


  // In your AuthContext.js
const updateUserProfile = async (updatedUserData) => {
  try {
    // Update user in state
    setUser(prev => ({
      ...prev,
      ...updatedUserData
    }));
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
};
  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    updateProfile,
    updateUserProfile,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
