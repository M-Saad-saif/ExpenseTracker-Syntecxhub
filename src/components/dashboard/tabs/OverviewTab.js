import React from "react";
import { FaArrowUp, FaArrowDown, FaPiggyBank } from "react-icons/fa";
import { format } from "date-fns";
import ExpenseChart from "../../ExpenseChart";

const OverviewTab = ({
  monthlyIncomes,
  monthlyExpenses,
  currentMonth,
  currentYear,
}) => {
  const totalMonthlyIncome = monthlyIncomes.total || 0;
  const totalMonthlyExpense = monthlyExpenses.total || 0;
  const monthlySavings = totalMonthlyIncome - totalMonthlyExpense;

  function capitalizeFirstLetter(string) {
    if (string.length === 0) {
      return "";
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="overview">
      <h1 className="page-title">Financial Overview</h1>
      <p className="page-subtitle">{format(new Date(), "MMMM yyyy")}</p>

      {/* Summary Cards */}
      <div className="summary-cards">

        
        <div className="summary-card income-card">
          <div className="card-icon">
            <FaArrowUp />
          </div>
          <div className="card-content">
            <p className="card-label">Total Income</p>
            <h3 className="card-value">Rs: {totalMonthlyIncome}/-</h3>
          </div>
        </div>

        <div className="summary-card expense-card">
          <div className="card-icon">
            <FaArrowDown />
          </div>
          <div className="card-content">
            <p className="card-label">Total Expenses</p>
            <h3 className="card-value">Rs: {totalMonthlyExpense}/-</h3>
          </div>
        </div>

        <div
          className={`summary-card ${monthlySavings >= 0 ? "savings-card" : "deficit-card"}`}
        >
          <div className="card-icon">
            <FaPiggyBank />
          </div>
          <div className="card-content">
            <p className="card-label">
              {monthlySavings >= 0 ? "Savings" : "Deficit"}
            </p>
            <h3 className="card-value">Rs: {Math.abs(monthlySavings)}/-</h3>
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
                  <p className="transaction-title">{capitalizeFirstLetter(expense.title)}</p>
                  <p className="transaction-category">{expense.category}</p>
                </div>
                <p className="transaction-amount">-Rs: {expense.amount}/-</p>
              </div>
            ))}
            {(!monthlyExpenses.expenses ||
              monthlyExpenses.expenses.length === 0) && (
              <p className="no-data">No expenses this month</p>
            )}
          </div>

          {/* Recent Income */}
          <div className="transaction-list">
            <h3>Latest Income</h3>
            {monthlyIncomes.incomes?.slice(0, 5).map((income) => (
              <div key={income._id} className="transaction-item income">
                <div className="transaction-info">
                  <p className="transaction-title">{capitalizeFirstLetter(income.title)}</p>
                  <p className="transaction-category">{income.category}</p>
                </div>
                <p className="transaction-amount">+Rs: {income.amount}/-</p>
              </div>
            ))}
            {(!monthlyIncomes.incomes ||
              monthlyIncomes.incomes.length === 0) && (
              <p className="no-data">No income this month</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
