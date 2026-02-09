import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import "./ExpenseChart.css";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const ExpenseChart = ({ expensesByCategory, incomesByCategory }) => {
  // Prepare data for Pie Chart (Expenses)
  const expenseCategories = Object.keys(expensesByCategory || {});
  const expenseAmounts = Object.values(expensesByCategory || {});

  const expensePieData = {
    labels: expenseCategories,
    datasets: [
      {
        label: "Expenses by Category",
        data: expenseAmounts,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6384",
          "#C9CBCF",
          "#4BC0C0",
          "#FF6384",
          "#36A2EB",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  // Prepare data for Income Pie Chart
  const incomeCategories = Object.keys(incomesByCategory || {});
  const incomeAmounts = Object.values(incomesByCategory || {});

  const incomePieData = {
    labels: incomeCategories,
    datasets: [
      {
        label: "Income by Category",
        data: incomeAmounts,
        backgroundColor: [
          "#4CAF50",
          "#8BC34A",
          "#CDDC39",
          "#FFC107",
          "#FF9800",
          "#FF5722",
          "#795548",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  // Prepare data for Bar Chart (Comparison)
  const allCategories = [
    ...new Set([...expenseCategories, ...incomeCategories]),
  ];
  const expenseData = allCategories.map((cat) => expensesByCategory[cat] || 0);
  const incomeData = allCategories.map((cat) => incomesByCategory[cat] || 0);

  const barData = {
    labels: allCategories,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: "#4CAF50",
        borderColor: "#388E3C",
        borderWidth: 1,
      },
      {
        label: "Expenses",
        data: expenseData,
        backgroundColor: "#FF6384",
        borderColor: "#E53935",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let value;

            if (typeof context.parsed === "object") {
              value = context.parsed.y;
            } else {
              value = context.parsed;
            }

            const numericValue =
              typeof value === "number" && !isNaN(value) ? value : 0;
            return `${context.label}: $${numericValue.toFixed(2)}`;
          },
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            return `${label}: $${value.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-section">
      <h2>Financial Analytics</h2>

      <div className="charts-grid">
        {/* Expense Pie Chart */}
        {expenseCategories.length > 0 && (
          <div className="chart-card">
            <h3>Expenses by Category</h3>
            <div className="chart-wrapper">
              <Pie data={expensePieData} options={pieOptions} />
            </div>
          </div>
        )}

        {/* Income Pie Chart */}
        {incomeCategories.length > 0 && (
          <div className="chart-card">
            <h3>Income by Category</h3>
            <div className="chart-wrapper">
              <Pie data={incomePieData} options={pieOptions} />
            </div>
          </div>
        )}
      </div>

      {/* Bar Chart - Comparison */}
      {(expenseCategories.length > 0 || incomeCategories.length > 0) && (
        <div className="chart-card full-width">
          <h3>Income vs Expenses Comparison</h3>
          <div className="chart-wrapper">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>
      )}

      {expenseCategories.length === 0 && incomeCategories.length === 0 && (
        <p className="no-chart-data">
          No data available for charts. Add some expenses or income to see
          visualizations.
        </p>
      )}
    </div>
  );
};

export default ExpenseChart;
