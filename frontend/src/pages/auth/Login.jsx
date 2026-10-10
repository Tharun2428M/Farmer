import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, User, Tractor, Shield, ArrowLeft } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to role dashboard
  React.useEffect(() => {
    if (isAuthenticated && user?.role) {
      if (user.role === 'CUSTOMER') navigate('/customer/dashboard', { replace: true });
      else if (user.role === 'FARMER') navigate('/farmer/dashboard', { replace: true });
      else if (user.role === 'ADMIN') navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const response = await login(email, password);
      const userRole = response?.user?.role;

      // Check if user was redirected from a protected route
      const fromPath = location.state?.from?.pathname;

      if (fromPath && !fromPath.includes('/login') && !fromPath.includes('/signup')) {
        navigate(fromPath, { replace: true });
      } else {
        // Role-based destination redirect
        if (userRole === 'CUSTOMER') {
          navigate('/customer/dashboard', { replace: true });
        } else if (userRole === 'FARMER') {
          navigate('/farmer/dashboard', { replace: true });
        } else if (userRole === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/products', { replace: true });
        }
      }
    } catch (err) {
      setServerError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo auto-fill helper for test evaluation
  const handleFillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrors({});
    setServerError('');
  };

  return (
    <div className="auth-page-wrapper">
      {/* Return to Home / Storefront Link */}
      <Link
        to="/"
        className="auth-back-link"
        style={{
          position: 'absolute',
          top: '1.25rem',
          left: '1.25rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          color: '#1b4332',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(8px)',
          padding: '0.5rem 1rem',
          borderRadius: '9999px',
          fontWeight: '700',
          fontSize: '0.85rem',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          textDecoration: 'none',
          zIndex: 10,
          border: '1px solid rgba(0, 0, 0, 0.06)',
          transition: 'all 0.2s ease'
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Store</span>
      </Link>

      <div className="auth-card-panel">
        
        {/* 3-Leaf Sprout Green Logo */}
        <Link to="/" className="auth-logo-box" title="Return to FarmersMarket Home" style={{ textDecoration: 'none' }}>
          <svg
            className="auth-logo-svg"
            viewBox="0 0 48 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Farmers Marketplace Logo"
          >
            {/* Left Leaf */}
            <path
              d="M22 28C14 26 8 18 10 10C17 9 24 16 23 25"
              fill="#52b788"
            />
            <path
              d="M10 10C16 17 20 23 22 28"
              stroke="#3a8b62"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Center Leaf */}
            <path
              d="M24 28C20 18 20 8 24 2C28 8 28 18 24 28Z"
              fill="#40916c"
            />
            <path
              d="M24 2V28"
              stroke="#2d6a4f"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Right Leaf */}
            <path
              d="M26 28C34 26 40 18 38 10C31 9 24 16 25 25"
              fill="#52b788"
            />
            <path
              d="M38 10C32 17 28 23 26 28"
              stroke="#3a8b62"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Base Stem */}
            <path
              d="M24 28V36"
              stroke="#40916c"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </Link>

        {/* Small Orange Pre-Heading */}
        <p className="auth-pre-title">Welcome Back!</p>

        {/* Large White Heading */}
        <h1 className="auth-main-title">Login to Your Account</h1>

        {/* Subtitle */}
        <p className="auth-subtitle-text">
          Access your account to continue<br />fresh and healthy journey.
        </p>

        {/* Server Error Alert */}
        {serverError && (
          <div style={{
            padding: '0.8rem 1rem',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: '8px',
            marginBottom: '1.25rem',
            fontSize: '0.8125rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            border: '1px solid #f87171'
          }}>
            <AlertCircle size={18} color="#dc2626" style={{ flexShrink: 0 }} />
            <span>{serverError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Email Field */}
          <div className="auth-field-group">
            <label htmlFor="login-email" className="auth-field-label">
              Email Address
            </label>
            <div className="auth-input-container">
              <span className="auth-left-icon">
                <Mail size={18} />
              </span>
              <input
                id="login-email"
                type="email"
                className={`auth-input-elem ${errors.email ? 'has-error' : ''}`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                disabled={loading}
                autoComplete="email"
                required
              />
            </div>
            {errors.email && <span className="auth-error-msg">{errors.email}</span>}
          </div>

          {/* Password Field */}
          <div className="auth-field-group" style={{ marginBottom: '0.35rem' }}>
            <label htmlFor="login-password" className="auth-field-label">
              Password
            </label>
            <div className="auth-input-container">
              <span className="auth-left-icon">
                <Lock size={18} />
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className={`auth-input-elem ${errors.password ? 'has-error' : ''}`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                disabled={loading}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="auth-right-action-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="auth-error-msg">{errors.password}</span>}
          </div>

          {/* Forgot Password Link */}
          <div className="auth-forgot-row">
            <button
              type="button"
              className="auth-forgot-link"
              onClick={() => alert('Password reset instructions will be sent to your registered email address.')}
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
            id="login-submit-button"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* 'or' Divider */}
        <div className="auth-or-divider">
          <span>or</span>
        </div>

        {/* Bottom Navigation */}
        <div className="auth-switch-link-wrapper">
          <span>Don't have an account?</span>
          <Link to="/signup" className="auth-switch-link-accent">
            Sign Up
          </Link>
        </div>

        {/* Demo Quick-Autofill Helpers */}
        <div className="auth-demo-helper-box">
          <p className="auth-demo-helper-title">
            Quick Demo Autofill
          </p>
          <div className="auth-demo-pills-row">
            <button
              type="button"
              className="auth-demo-pill-btn"
              onClick={() => handleFillDemo('customer@farmersmarket.local', 'Password123')}
              disabled={loading}
            >
              <User size={13} />
              <span>Customer</span>
            </button>
            <button
              type="button"
              className="auth-demo-pill-btn"
              onClick={() => handleFillDemo('farmer@farmersmarket.local', 'Password123')}
              disabled={loading}
            >
              <Tractor size={13} />
              <span>Farmer</span>
            </button>
            <button
              type="button"
              className="auth-demo-pill-btn"
              onClick={() => handleFillDemo('admin@farmersmarket.local', 'Password123')}
              disabled={loading}
            >
              <Shield size={13} />
              <span>Admin</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
