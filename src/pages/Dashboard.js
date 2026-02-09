import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../utils/api';
import {
  FaSignOutAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUser,
  FaChartPie,
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaPiggyBank,
} from 'react-icons/fa';
import { format } from 'date-fns';
import ExpenseChart from '../components/ExpenseChart';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear] = useState(new Date().getFullYear());

  // State for expenses and incomes
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [monthlyIncomes, setMonthlyIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for forms
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);

  // Form data
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    amount: '',
    category: 'Food & Dining',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [incomeForm, setIncomeForm] = useState({
    title: '',
    amount: '',
    category: 'Salary',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    monthlyBudget: user?.monthlyBudget || '',
  });

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
      setExpenses(response.data.data);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    }
  };

  const fetchIncomes = async () => {
    try {
      const response = await api.get('/incomes');
      setIncomes(response.data.data);
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

      setMonthlyExpenses(expensesRes.data.data);
      setMonthlyIncomes(incomesRes.data.data);
    } catch (error) {
      console.error('Failed to fetch monthly data:', error);
    }
  };

  // Calculate totals
  const totalMonthlyIncome = monthlyIncomes.total || 0;
  const totalMonthlyExpense = monthlyExpenses.total || 0;
  const monthlySavings = totalMonthlyIncome - totalMonthlyExpense;

  // Handle Expense Operations
  const handleExpenseSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingExpense) {
        await api.put(`/expenses/${editingExpense._id}`, expenseForm);
        toast.success('Expense updated successfully');
      } else {
        await api.post('/expenses', expenseForm);
        toast.success('Expense added successfully');
      }

      resetExpenseForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.delete(`/expenses/${id}`);
        toast.success('Expense deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete expense');
      }
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setExpenseForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      description: expense.description || '',
      date: new Date(expense.date).toISOString().split('T')[0],
    });
    setShowExpenseForm(true);
  };

  const resetExpenseForm = () => {
    setExpenseForm({
      title: '',
      amount: '',
      category: 'Food & Dining',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setEditingExpense(null);
    setShowExpenseForm(false);
  };

  // Handle Income Operations
  const handleIncomeSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingIncome) {
        await api.put(`/incomes/${editingIncome._id}`, incomeForm);
        toast.success('Income updated successfully');
      } else {
        await api.post('/incomes', incomeForm);
        toast.success('Income added successfully');
      }

      resetIncomeForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeleteIncome = async (id) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      try {
        await api.delete(`/incomes/${id}`);
        toast.success('Income deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete income');
      }
    }
  };

  const handleEditIncome = (income) => {
    setEditingIncome(income);
    setIncomeForm({
      title: income.title,
      amount: income.amount,
      category: income.category,
      description: income.description || '',
      date: new Date(income.date).toISOString().split('T')[0],
    });
    setShowIncomeForm(true);
  };

  const resetIncomeForm = () => {
    setIncomeForm({
      title: '',
      amount: '',
      category: 'Salary',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setEditingIncome(null);
    setShowIncomeForm(false);
  };

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    const updateData = {
      name: profileForm.name,
      email: profileForm.email,
      monthlyBudget: profileForm.monthlyBudget,
    };

    if (profileForm.password) {
      updateData.password = profileForm.password;
    }

    const result = await updateProfile(updateData);

    if (result.success) {
      toast.success('Profile updated successfully');
      setShowProfileForm(false);
      setProfileForm({ ...profileForm, password: '' });
    } else {
      toast.error(result.message);
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
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview">
              <h1 className="page-title">Financial Overview</h1>
              <p className="page-subtitle">
                {format(new Date(), 'MMMM yyyy')}
              </p>

              {/* Summary Cards */}
              <div className="summary-cards">
                <div className="summary-card income-card">
                  <div className="card-icon">
                    <FaArrowUp />
                  </div>
                  <div className="card-content">
                    <p className="card-label">Total Income</p>
                    <h3 className="card-value">${totalMonthlyIncome.toFixed(2)}</h3>
                  </div>
                </div>

                <div className="summary-card expense-card">
                  <div className="card-icon">
                    <FaArrowDown />
                  </div>
                  <div className="card-content">
                    <p className="card-label">Total Expenses</p>
                    <h3 className="card-value">${totalMonthlyExpense.toFixed(2)}</h3>
                  </div>
                </div>

                <div className={`summary-card ${monthlySavings >= 0 ? 'savings-card' : 'deficit-card'}`}>
                  <div className="card-icon">
                    <FaPiggyBank />
                  </div>
                  <div className="card-content">
                    <p className="card-label">
                      {monthlySavings >= 0 ? 'Savings' : 'Deficit'}
                    </p>
                    <h3 className="card-value">${Math.abs(monthlySavings).toFixed(2)}</h3>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="charts-container">
                <ExpenseChart
                  expensesByCategory={monthlyExpenses.byCategory || {}}
                  incomesByCategory={monthlyIncomes.byCategory || {}}
                />
              </div>

              {/* Recent Transactions */}
              <div className="recent-transactions">
                <h2>Recent Transactions</h2>
                <div className="transactions-grid">
                  {/* Recent Expenses */}
                  <div className="transaction-list">
                    <h3>Latest Expenses</h3>
                    {monthlyExpenses.expenses?.slice(0, 5).map((expense) => (
                      <div key={expense._id} className="transaction-item expense">
                        <div className="transaction-info">
                          <p className="transaction-title">{expense.title}</p>
                          <p className="transaction-category">{expense.category}</p>
                        </div>
                        <p className="transaction-amount">-${expense.amount.toFixed(2)}</p>
                      </div>
                    ))}
                    {(!monthlyExpenses.expenses || monthlyExpenses.expenses.length === 0) && (
                      <p className="no-data">No expenses this month</p>
                    )}
                  </div>

                  {/* Recent Income */}
                  <div className="transaction-list">
                    <h3>Latest Income</h3>
                    {monthlyIncomes.incomes?.slice(0, 5).map((income) => (
                      <div key={income._id} className="transaction-item income">
                        <div className="transaction-info">
                          <p className="transaction-title">{income.title}</p>
                          <p className="transaction-category">{income.category}</p>
                        </div>
                        <p className="transaction-amount">+${income.amount.toFixed(2)}</p>
                      </div>
                    ))}
                    {(!monthlyIncomes.incomes || monthlyIncomes.incomes.length === 0) && (
                      <p className="no-data">No income this month</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Expenses Tab */}
          {activeTab === 'expenses' && (
            <div className="expenses-section">
              <div className="section-header">
                <h1>Manage Expenses</h1>
                <button
                  className="btn-add"
                  onClick={() => setShowExpenseForm(!showExpenseForm)}
                >
                  <FaPlus /> Add Expense
                </button>
              </div>

              {/* Add/Edit Form */}
              {showExpenseForm && (
                <div className="form-card">
                  <h3>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h3>
                  <form onSubmit={handleExpenseSubmit} className="expense-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Title</label>
                        <input
                          type="text"
                          value={expenseForm.title}
                          onChange={(e) =>
                            setExpenseForm({ ...expenseForm, title: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          value={expenseForm.amount}
                          onChange={(e) =>
                            setExpenseForm({ ...expenseForm, amount: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Category</label>
                        <select
                          value={expenseForm.category}
                          onChange={(e) =>
                            setExpenseForm({ ...expenseForm, category: e.target.value })
                          }
                        >
                          <option>Food & Dining</option>
                          <option>Transportation</option>
                          <option>Shopping</option>
                          <option>Entertainment</option>
                          <option>Bills & Utilities</option>
                          <option>Healthcare</option>
                          <option>Education</option>
                          <option>Travel</option>
                          <option>Housing</option>
                          <option>Personal Care</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Date</label>
                        <input
                          type="date"
                          value={expenseForm.date}
                          onChange={(e) =>
                            setExpenseForm({ ...expenseForm, date: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Description (Optional)</label>
                      <textarea
                        value={expenseForm.description}
                        onChange={(e) =>
                          setExpenseForm({ ...expenseForm, description: e.target.value })
                        }
                        rows="3"
                      />
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn-submit">
                        {editingExpense ? 'Update' : 'Add'} Expense
                      </button>
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={resetExpenseForm}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Expenses List */}
              <div className="expenses-list">
                <h3>All Expenses</h3>
                {expenses.length > 0 ? (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Title</th>
                          <th>Category</th>
                          <th>Amount</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenses.map((expense) => (
                          <tr key={expense._id}>
                            <td>{format(new Date(expense.date), 'MMM dd, yyyy')}</td>
                            <td>{expense.title}</td>
                            <td>
                              <span className="category-badge">{expense.category}</span>
                            </td>
                            <td className="amount-cell">${expense.amount.toFixed(2)}</td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="btn-icon btn-edit"
                                  onClick={() => handleEditExpense(expense)}
                                  title="Edit"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  className="btn-icon btn-delete"
                                  onClick={() => handleDeleteExpense(expense._id)}
                                  title="Delete"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="no-data">No expenses found. Add your first expense!</p>
                )}
              </div>
            </div>
          )}

          {/* Income Tab */}
          {activeTab === 'income' && (
            <div className="income-section">
              <div className="section-header">
                <h1>Manage Income</h1>
                <button
                  className="btn-add"
                  onClick={() => setShowIncomeForm(!showIncomeForm)}
                >
                  <FaPlus /> Add Income
                </button>
              </div>

              {/* Add/Edit Form */}
              {showIncomeForm && (
                <div className="form-card">
                  <h3>{editingIncome ? 'Edit Income' : 'Add New Income'}</h3>
                  <form onSubmit={handleIncomeSubmit} className="income-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Title</label>
                        <input
                          type="text"
                          value={incomeForm.title}
                          onChange={(e) =>
                            setIncomeForm({ ...incomeForm, title: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          value={incomeForm.amount}
                          onChange={(e) =>
                            setIncomeForm({ ...incomeForm, amount: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Category</label>
                        <select
                          value={incomeForm.category}
                          onChange={(e) =>
                            setIncomeForm({ ...incomeForm, category: e.target.value })
                          }
                        >
                          <option>Salary</option>
                          <option>Freelance</option>
                          <option>Business</option>
                          <option>Investment</option>
                          <option>Rental</option>
                          <option>Gift</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Date</label>
                        <input
                          type="date"
                          value={incomeForm.date}
                          onChange={(e) =>
                            setIncomeForm({ ...incomeForm, date: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Description (Optional)</label>
                      <textarea
                        value={incomeForm.description}
                        onChange={(e) =>
                          setIncomeForm({ ...incomeForm, description: e.target.value })
                        }
                        rows="3"
                      />
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn-submit">
                        {editingIncome ? 'Update' : 'Add'} Income
                      </button>
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={resetIncomeForm}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Income List */}
              <div className="income-list">
                <h3>All Income</h3>
                {incomes.length > 0 ? (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Title</th>
                          <th>Category</th>
                          <th>Amount</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {incomes.map((income) => (
                          <tr key={income._id}>
                            <td>{format(new Date(income.date), 'MMM dd, yyyy')}</td>
                            <td>{income.title}</td>
                            <td>
                              <span className="category-badge income-badge">
                                {income.category}
                              </span>
                            </td>
                            <td className="amount-cell income-amount">
                              ${income.amount.toFixed(2)}
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="btn-icon btn-edit"
                                  onClick={() => handleEditIncome(income)}
                                  title="Edit"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  className="btn-icon btn-delete"
                                  onClick={() => handleDeleteIncome(income._id)}
                                  title="Delete"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="no-data">No income found. Add your first income!</p>
                )}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="profile-section">
              <h1>User Profile</h1>

              <div className="profile-card">
                <div className="profile-header">
                  <div className="profile-avatar">
                    <FaUser />
                  </div>
                  <div className="profile-info">
                    <h2>{user?.name}</h2>
                    <p>{user?.email}</p>
                  </div>
                </div>

                {!showProfileForm ? (
                  <div className="profile-details">
                    <div className="detail-item">
                      <label>Monthly Budget</label>
                      <p>${user?.monthlyBudget || 0}</p>
                    </div>
                    <div className="detail-item">
                      <label>Member Since</label>
                      <p>{format(new Date(user?.createdAt || Date.now()), 'MMMM yyyy')}</p>
                    </div>
                    <button
                      className="btn-edit-profile"
                      onClick={() => setShowProfileForm(true)}
                    >
                      <FaEdit /> Edit Profile
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleProfileSubmit} className="profile-form">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, email: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Monthly Budget</label>
                      <input
                        type="number"
                        step="0.01"
                        value={profileForm.monthlyBudget}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, monthlyBudget: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>New Password (leave blank to keep current)</label>
                      <input
                        type="password"
                        value={profileForm.password}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, password: e.target.value })
                        }
                        placeholder="Enter new password"
                      />
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn-submit">
                        Save Changes
                      </button>
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => {
                          setShowProfileForm(false);
                          setProfileForm({
                            name: user?.name || '',
                            email: user?.email || '',
                            password: '',
                            monthlyBudget: user?.monthlyBudget || '',
                          });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;