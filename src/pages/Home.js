import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaChartLine, FaWallet, FaPiggyBank, FaLock } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="home-page">
      {/* Navigation */}
      <nav className="home-nav">
        <div className="nav-container">
          <div className="logo">
            <FaWallet className="logo-icon" />
            <span>ExpenseTracker</span>
          </div>
          <div className="nav-links">
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Take Control of Your <span className="highlight">Finances</span>
          </h1>
          <p className="hero-subtitle">
            Track expenses, manage income, and achieve your financial goals with
            our powerful and intuitive expense tracking platform.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-hero-primary">
              Start Tracking Free
            </Link>
            <Link to="/login" className="btn-hero-secondary">
              Sign In
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-card card-1">
            <FaChartLine className="visual-icon" />
            <p>Track Spending</p>
          </div>
          <div className="visual-card card-2">
            <FaPiggyBank className="visual-icon" />
            <p>Save Money</p>
          </div>
          <div className="visual-card card-3">
            <FaWallet className="visual-icon" />
            <p>Manage Budget</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Why Choose ExpenseTracker?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaChartLine />
            </div>
            <h3>Visual Analytics</h3>
            <p>
              Beautiful charts and graphs help you understand your spending
              patterns at a glance.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaWallet />
            </div>
            <h3>Category Tracking</h3>
            <p>
              Organize expenses by categories to see exactly where your money
              goes each month.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaPiggyBank />
            </div>
            <h3>Budget Management</h3>
            <p>
              Set monthly budgets and track your progress towards your savings
              goals.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaLock />
            </div>
            <h3>Secure & Private</h3>
            <p>
              Your financial data is encrypted and secure. We take your privacy
              seriously.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Managing Your Money Better?</h2>
          <p>Join thousands of users who are taking control of their finances</p>
          <Link to="/register" className="btn-cta">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>&copy; 2024 ExpenseTracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;