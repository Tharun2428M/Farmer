import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, UserPlus, ShoppingBag, Tractor, AlertCircle, ShieldAlert } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';

export const Signup = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, user } = useAuth();
  
  // Account type state: strictly 'CUSTOMER' or 'FARMER' (ADMIN is prohibited)
  const [role, setRole] = useState('CUSTOMER');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

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
      // Security: Strictly enforce CUSTOMER or FARMER payload
      const registeredRole = role === 'FARMER' ? 'FARMER' : 'CUSTOMER';

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
        // Backend validation errors from MethodArgumentNotValidException
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
    <div style={{
      backgroundColor: 'var(--bg-app)',
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3.5rem 1.25rem'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '520px',
        padding: '2.5rem',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-md)'
      }}>
        {/* Brand Icon Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-800)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem auto'
          }}>
            <Sprout size={28} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary-900)' }}>
            Join the Marketplace
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Create an account to buy or sell fresh local harvest
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div style={{
            padding: '0.85rem 1rem',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
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

        {/* Account Role Selector Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.85rem',
          marginBottom: '1.5rem'
        }}>
          {/* Customer Choice */}
          <div
            onClick={() => !loading && setRole('CUSTOMER')}
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${role === 'CUSTOMER' ? 'var(--primary-700)' : 'var(--border-light)'}`,
              backgroundColor: role === 'CUSTOMER' ? 'var(--primary-50)' : 'var(--bg-surface-subtle)',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'all var(--transition-fast)'
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: role === 'CUSTOMER' ? 'var(--primary-100)' : '#e2e8f0',
              color: role === 'CUSTOMER' ? 'var(--primary-800)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.5rem'
            }}>
              <ShoppingBag size={18} />
            </div>
            <strong style={{ fontSize: '0.9375rem', color: 'var(--primary-900)' }}>Customer</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Buy fresh produce</span>
          </div>

          {/* Farmer Choice */}
          <div
            onClick={() => !loading && setRole('FARMER')}
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${role === 'FARMER' ? 'var(--primary-700)' : 'var(--border-light)'}`,
              backgroundColor: role === 'FARMER' ? 'var(--primary-50)' : 'var(--bg-surface-subtle)',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'all var(--transition-fast)'
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: role === 'FARMER' ? '#fff3e0' : '#e2e8f0',
              color: role === 'FARMER' ? '#e65100' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.5rem'
            }}>
              <Tractor size={18} />
            </div>
            <strong style={{ fontSize: '0.9375rem', color: 'var(--primary-900)' }}>Farmer</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sell your harvest</span>
          </div>
        </div>

        {/* Security Notice on ADMIN role */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginBottom: '1.5rem',
          padding: '0.4rem 0.75rem',
          backgroundColor: 'var(--bg-app)',
          borderRadius: 'var(--radius-sm)'
        }}>
          <ShieldAlert size={14} color="var(--primary-600)" />
          <span>System Rule: Admin accounts cannot be created via public registration.</span>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            error={errors.fullName || errors.name}
            placeholder="e.g. Ramesh Patil"
            disabled={loading}
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            placeholder="e.g. ramesh@example.com"
            disabled={loading}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={errors.phone}
            placeholder="10-digit mobile number (e.g. 9876543210)"
            disabled={loading}
            required
          />

          <Input
            label="Create Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            placeholder="Minimum 6 characters"
            disabled={loading}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
            placeholder="Re-enter password"
            disabled={loading}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            icon={<UserPlus size={18} />}
          >
            {loading ? 'Creating account...' : `Create ${role === 'FARMER' ? 'Farmer' : 'Customer'} Account`}
          </Button>
        </form>

        {/* Link to login */}
        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-800)', fontWeight: '700' }}>
            Sign In Here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;
