import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import api from '../../../utils/api';

const IncomeTab = ({ incomes, fetchData }) => {
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [incomeForm, setIncomeForm] = useState({
    title: '',
    amount: '',
    category: 'Salary',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

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

  return (
    <div className="income-section">
      <div className="section-header">
        <h1>Manage Income</h1>
        <button
          className="btn-add"
          onClick={() => setShowIncomeForm(!showIncomeForm)}
        >
          <FaPlus /> {showIncomeForm ? 'Close Form' : 'Add Income'}
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
  );
};

export default IncomeTab;