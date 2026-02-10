// pages/Dashboard.js
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import api from "../utils/api";
import {
  FaSignOutAlt,
  FaUser,
  FaChartPie,
  FaWallet,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";

import OverviewTab from "../components/dashboard/tabs/OverviewTab";
import ExpensesTab from "../components/dashboard/tabs/ExpensesTab";
import IncomeTab from "../components/dashboard/tabs/IncomeTab";
import ProfileTab from "../components/dashboard/tabs/ProfileTab";

import "./Dashboard.css";

const Dashboard = () => {
  const { user, logout, updateProfile, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear] = useState(new Date().getFullYear());

  // State for expenses and incomes
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState({});
  const [monthlyIncomes, setMonthlyIncomes] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  function capitalizeFirstLetter(string) {
    if (string.length === 0) {
      return "";
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Fetch data on mount
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchExpenses(), fetchIncomes(), fetchMonthlyData()]);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await api.get("/expenses");
      setExpenses(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  const fetchIncomes = async () => {
    try {
      const response = await api.get("/incomes");
      setIncomes(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch incomes:", error);
    }
  };

  const fetchMonthlyData = async () => {
    try {
      const [expensesRes, incomesRes] = await Promise.all([
        api.get(`/expenses/monthly/${currentYear}/${currentMonth}`),
        api.get(`/incomes/monthly/${currentYear}/${currentMonth}`),
      ]);

      setMonthlyExpenses(expensesRes.data.data || {});
      setMonthlyIncomes(incomesRes.data.data || {});
    } catch (error) {
      console.error("Failed to fetch monthly data:", error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // Add this function to handle profile picture upload
  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    await uploadProfilePicture(file);
  };

  // Add this function to upload to your backend
  const uploadProfilePicture = async (file) => {
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("profileImage", file); // Must match the field name in multer

      const response = await api.post("/auth/uploadprofilepic", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Profile picture updated successfully");
        if (response.data.user) {
          updateUserProfile(response.data.user);
        }

        // Clear preview after successful upload
        setPreviewImage(null);
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error(
        error.response?.data?.error || "Failed to upload profile picture",
      );
      setPreviewImage(null);
    } finally {
      setUploadingImage(false);
      // Clear the file input
      document.getElementById("profile-upload").value = "";
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">
            <FaWallet className="logo-icon " />
            <span
              style={{
                color: "black",
              }}
            >
              ExpenseTracker
            </span>
          </div>
          <div className="header-actions">
            <div className="user-info">
              <FaUser />
              <span>{capitalizeFirstLetter(user?.name)}</span>
            </div>
            <button onClick={logout} className="btn-logout">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-main">
        <aside className="sidebar">
          {/* Profile Section */} 
          <div className="sidebar-profile">
            <div className="profile-image-container">
              <div className="profile-image-wrapper">
                {uploadingImage ? (
                  <div className="profile-image-loading">
                    <FaSpinner className="spinner-icon" />
                  </div>
                ) : (
                  <>
                    <img
                      src={
                        previewImage ||
                        user.profileImage ||
                        "/default-profile.png"
                      }
                      alt={user.name}
                      className="profile-image"
                      onClick={() =>
                        !uploadingImage &&
                        document.getElementById("profile-upload").click()
                      }
                    />
                    <div className="profile-upload-overlay">
                      <label htmlFor="profile-upload" className="upload-label">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="white"
                        >
                          <path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z" />
                        </svg>
                      </label>
                    </div>
                  </>
                )}
              </div>

              <input
                type="file"
                id="profile-upload"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleProfilePictureChange}
                disabled={uploadingImage}
              />

              <div className="profile-info">
                <h3 className="profile-name">{user?.name}</h3>
                <p className="profile-email">{user?.email}</p>
                {uploadingImage && (
                  <div className="uploading-text">Uploading...</div>
                )}
              </div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <FaChartPie className="nav-icon" />
              <span>Overview</span>
            </button>
            <button
              className={`nav-item ${activeTab === "expenses" ? "active" : ""}`}
              onClick={() => setActiveTab("expenses")}
            >
              <FaArrowDown className="nav-icon" />
              <span>Expenses</span>
            </button>
            <button
              className={`nav-item ${activeTab === "income" ? "active" : ""}`}
              onClick={() => setActiveTab("income")}
            >
              <FaArrowUp className="nav-icon" />
              <span>Income</span>
            </button>
            <button
              className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <FaUser className="nav-icon" />
              <span>Profile</span>
            </button>
          </nav>

          {/* Monthly Budget Display */}
          <div className="sidebar-budget">
            <div className="budget-header">
              <FaWallet className="budget-icon" />
              <h4>Monthly Budget</h4>
            </div>
            <div className="budget-amount">
              Rs: {user?.monthlyBudget || 0}/-
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="content">
          {/* Render Active Tab */}
          {activeTab === "overview" && (
            <OverviewTab
              monthlyIncomes={monthlyIncomes}
              monthlyExpenses={monthlyExpenses}
            />
          )}

          {activeTab === "expenses" && (
            <ExpensesTab expenses={expenses} fetchData={fetchData} />
          )}

          {activeTab === "income" && (
            <IncomeTab incomes={incomes} fetchData={fetchData} />
          )}

          {activeTab === "profile" && (
            <ProfileTab user={user} updateProfile={updateProfile} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
