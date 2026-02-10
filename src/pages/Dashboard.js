// pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../utils/api';
import {
  FaSignOutAlt,
  FaUser,
  FaChartPie,
  FaWallet,
  FaArrowUp,
  FaArrowDown,
} from 'react-icons/fa';

import OverviewTab from '../components/dashboard/tabs/OverviewTab';
import ExpensesTab from '../components/dashboard/tabs/ExpensesTab';
import IncomeTab from '../components/dashboard/tabs/IncomeTab';
import ProfileTab from '../components/dashboard/tabs/ProfileTab';

import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear] = useState(new Date().getFullYear());

  // State for expenses and incomes
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState({});
  const [monthlyIncomes, setMonthlyIncomes] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchExpenses(),
        fetchIncomes(),
        fetchMonthlyData(),
      ]);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expenses');
      setExpenses(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    }
  };

  const fetchIncomes = async () => {
    try {
      const response = await api.get('/incomes');
      setIncomes(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch incomes:', error);
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
      console.error('Failed to fetch monthly data:', error);
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

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">
            <FaWallet className="logo-icon" />
            <span>ExpenseTracker</span>
          </div>
          <div className="header-actions">
            <div className="user-info">
              <FaUser />
              <span>{user?.name}</span>
            </div>
            <button onClick={logout} className="btn-logout">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <FaChartPie /> Overview
            </button>
            <button
              className={`nav-item ${activeTab === 'expenses' ? 'active' : ''}`}
              onClick={() => setActiveTab('expenses')}
            >
              <FaArrowDown /> Expenses
            </button>
            <button
              className={`nav-item ${activeTab === 'income' ? 'active' : ''}`}
              onClick={() => setActiveTab('income')}
            >
              <FaArrowUp /> Income
            </button>
            <button
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <FaUser /> Profile
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="content">
          {/* Render Active Tab */}
          {activeTab === 'overview' && (
            <OverviewTab 
              monthlyIncomes={monthlyIncomes}
              monthlyExpenses={monthlyExpenses}
            />
          )}
          
          {activeTab === 'expenses' && (
            <ExpensesTab 
              expenses={expenses}
              fetchData={fetchData}
            />
          )}
          
          {activeTab === 'income' && (
            <IncomeTab 
              incomes={incomes}
              fetchData={fetchData}
            />
          )}
          
          {activeTab === 'profile' && (
            <ProfileTab 
              user={user}
              updateProfile={updateProfile}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;