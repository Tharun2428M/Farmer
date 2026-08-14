import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, LogIn, AlertCircle, CheckCircle2, User, Tractor, Shield } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
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
    <div style={{
      backgroundColor: 'var(--bg-app)',
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3.5rem 1.25rem'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '2.5rem',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-md)'
      }}>
        {/* Brand Icon Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
            Welcome Back
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Sign in to access your direct marketplace account
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

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="you@example.com"
            disabled={loading}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            placeholder="Enter your password"
            disabled={loading}
            required
          />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            fontSize: '0.8125rem'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text-body)' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--primary-700)' }}
              />
              Remember me
            </label>

            <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
              Spring Boot + Supabase
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            icon={<LogIn size={18} />}
          >
            {loading ? 'Signing in...' : 'Sign In to Account'}
          </Button>
        </form>

        {/* Demo Fill Helper */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border-light)',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Quick Demo Autofill:
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFillDemo('customer@farmersmarket.local', 'Password123')}
              icon={<User size={13} />}
              disabled={loading}
            >
              Customer
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFillDemo('farmer@farmersmarket.local', 'Password123')}
              icon={<Tractor size={13} />}
              disabled={loading}
            >
              Farmer
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFillDemo('admin@farmersmarket.local', 'Admin@123')}
              icon={<Shield size={13} />}
              disabled={loading}
            >
              Admin
            </Button>
          </div>
        </div>

        {/* Sign up link */}
        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
          Don't have an account yet?{' '}
          <Link to="/signup" style={{ color: 'var(--primary-800)', fontWeight: '700' }}>
            Create an Account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
