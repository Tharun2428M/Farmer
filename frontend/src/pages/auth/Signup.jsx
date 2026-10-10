import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Eye, EyeOff, AlertCircle, Sprout, Store, Truck, ArrowLeft } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export const Signup = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, user } = useAuth();
  
  // Account type state: 'CUSTOMER', 'FARMER', or 'TRANSPORTER' (mapped to backend role)
  const [selectedRole, setSelectedRole] = useState('FARMER');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please provide a valid email address';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      errs.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
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
      // Map selected UI role to backend allowed role (FARMER or CUSTOMER)
      const registeredRole = selectedRole === 'FARMER' ? 'FARMER' : 'CUSTOMER';

      const response = await register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: registeredRole
      });

      const userRole = response?.user?.role || registeredRole;
      if (userRole === 'FARMER') {
        navigate('/farmer/dashboard', { replace: true });
      } else {
        navigate('/customer/dashboard', { replace: true });
      }
    } catch (err) {
      if (err.status === 409) {
        setServerError('An account with this email already exists. Please login instead.');
      } else if (err.data && typeof err.data === 'object') {
        setErrors(err.data);
        setServerError('Please correct the highlighted form errors.');
      } else {
        setServerError(err.message || 'Registration failed. Please check your connection to the server.');
      }
    } finally {
      setLoading(false);
    }
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
        <p className="auth-pre-title">Create Account</p>

        {/* Large White Heading */}
        <h1 className="auth-main-title">Sign Up</h1>

        {/* Subtitle */}
        <p className="auth-subtitle-text">
          Join our community and start your<br />fresh produce journey.
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

        {/* Signup Form */}
        <form onSubmit={handleSubmit} noValidate>
          
          {/* Full Name */}
          <div className="auth-field-group">
            <label htmlFor="signup-name" className="auth-field-label">
              Full Name
            </label>
            <div className="auth-input-container">
              <span className="auth-left-icon">
                <User size={18} />
              </span>
              <input
                id="signup-name"
                type="text"
                className={`auth-input-elem ${errors.fullName ? 'has-error' : ''}`}
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  if (errors.fullName) setErrors({ ...errors, fullName: null });
                }}
                disabled={loading}
                required
              />
            </div>
            {errors.fullName && <span className="auth-error-msg">{errors.fullName}</span>}
          </div>

          {/* Role Selector: I am a */}
          <div className="auth-field-group">
            <label className="auth-field-label">
              I am a
            </label>
            <div className="auth-role-selector-row">
              <div
                className={`auth-role-card ${selectedRole === 'FARMER' ? 'active' : ''}`}
                onClick={() => !loading && setSelectedRole('FARMER')}
              >
                <div className="auth-role-card-inner">
                  <Sprout size={16} color={selectedRole === 'FARMER' ? '#52b788' : '#88ab92'} />
                  <span>Farmer</span>
                </div>
                <div className="auth-role-radio-circle" />
              </div>

              <div
                className={`auth-role-card ${selectedRole === 'SELLER' ? 'active' : ''}`}
                onClick={() => !loading && setSelectedRole('SELLER')}
              >
                <div className="auth-role-card-inner">
                  <Store size={16} color={selectedRole === 'SELLER' ? '#52b788' : '#88ab92'} />
                  <span>Seller</span>
                </div>
                <div className="auth-role-radio-circle" />
              </div>

              <div
                className={`auth-role-card ${selectedRole === 'TRANSPORTER' ? 'active' : ''}`}
                onClick={() => !loading && setSelectedRole('TRANSPORTER')}
              >
                <div className="auth-role-card-inner">
                  <Truck size={16} color={selectedRole === 'TRANSPORTER' ? '#52b788' : '#88ab92'} />
                  <span>Transporter</span>
                </div>
                <div className="auth-role-radio-circle" />
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div className="auth-field-group">
            <label htmlFor="signup-email" className="auth-field-label">
              Email Address
            </label>
            <div className="auth-input-container">
              <span className="auth-left-icon">
                <Mail size={18} />
              </span>
              <input
                id="signup-email"
                type="email"
                className={`auth-input-elem ${errors.email ? 'has-error' : ''}`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                disabled={loading}
                autoComplete="email"
                required
              />
            </div>
            {errors.email && <span className="auth-error-msg">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="auth-field-group">
            <label htmlFor="signup-password" className="auth-field-label">
              Password
            </label>
            <div className="auth-input-container">
              <span className="auth-left-icon">
                <Lock size={18} />
              </span>
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                className={`auth-input-elem ${errors.password ? 'has-error' : ''}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                disabled={loading}
                autoComplete="new-password"
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

          {/* Confirm Password */}
          <div className="auth-field-group">
            <label htmlFor="signup-confirm-password" className="auth-field-label">
              Confirm Password
            </label>
            <div className="auth-input-container">
              <span className="auth-left-icon">
                <Lock size={18} />
              </span>
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                className={`auth-input-elem ${errors.confirmPassword ? 'has-error' : ''}`}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                }}
                disabled={loading}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="auth-right-action-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <span className="auth-error-msg">{errors.confirmPassword}</span>}
          </div>

          {/* Phone Number */}
          <div className="auth-field-group">
            <label htmlFor="signup-phone" className="auth-field-label">
              Phone Number
            </label>
            <div className="auth-input-container">
              <span className="auth-left-icon">
                <Phone size={18} />
              </span>
              <input
                id="signup-phone"
                type="tel"
                className={`auth-input-elem ${errors.phone ? 'has-error' : ''}`}
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: null });
                }}
                disabled={loading}
                autoComplete="tel"
                required
              />
            </div>
            {errors.phone && <span className="auth-error-msg">{errors.phone}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
            id="signup-submit-button"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        {/* 'or' Divider */}
        <div className="auth-or-divider">
          <span>or</span>
        </div>

        {/* Bottom Navigation */}
        <div className="auth-switch-link-wrapper">
          <span>Already have an account?</span>
          <Link to="/login" className="auth-switch-link-accent">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Signup;
