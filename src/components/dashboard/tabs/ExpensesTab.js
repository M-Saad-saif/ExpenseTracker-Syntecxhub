import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import api from '../../../utils/api';

const ExpensesTab = ({ expenses, fetchData }) => {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    amount: '',
    category: 'Food & Dining',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  function capitalizeFirstLetter(string) {
    if (string.length === 0) {
      return "";
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

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

  return (
    <div className="expenses-section">
       <title>Expense - ExpenseTracker</title>
      <div className="section-header">
        <h1>Manage Expenses</h1>
        <button
          className="btn-add"
          onClick={() => setShowExpenseForm(!showExpenseForm)}
        >
          <FaPlus /> {showExpenseForm ? 'Close Form' : 'Add Expense'}
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
                    <td>{capitalizeFirstLetter(expense.title)}</td>
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
  );
};

export default ExpensesTab;