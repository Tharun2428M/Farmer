import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { UserPlus, Tractor, ShoppingBag, Shield, Info } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'CUSTOMER';
  const [role, setRole] = useState(initialRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [farmName, setFarmName] = useState('');
  const [password, setPassword] = useState('');
  const { loginPlaceholder } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginPlaceholder({ name: fullName || email.split('@')[0], email, farmName }, role);
    
    if (role === 'FARMER') navigate('/dashboard/farmer');
    else if (role === 'ADMIN') navigate('/dashboard/admin');
    else navigate('/dashboard/customer');
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
      <div className="card glass-panel" style={{ maxWidth: '520px', margin: '0 auto', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: 'var(--earth-100)',
            color: 'var(--earth-800)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            <UserPlus size={26} />
          </div>
          <h2 className="heading-serif" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary-900)' }}>
            Create Account
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Join the Local Farmers Marketplace community
          </p>
        </div>

        {/* Role Selector */}
        <div className="form-group">
          <label className="form-label">Select Account Type</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {[
              { id: 'CUSTOMER', label: 'Customer', icon: <ShoppingBag size={14} /> },
              { id: 'FARMER', label: 'Farmer', icon: <Tractor size={14} /> },
              { id: 'ADMIN', label: 'Admin', icon: <Shield size={14} /> }
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                style={{
                  padding: '0.6rem 0.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: role === r.id ? '2px solid var(--primary-800)' : '1px solid var(--border-light)',
                  backgroundColor: role === r.id ? 'var(--primary-100)' : 'var(--bg-surface)',
                  color: role === r.id ? 'var(--primary-900)' : 'var(--text-main)',
                  fontWeight: role === r.id ? 700 : 500,
                  fontSize: '0.825rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
              >
                {r.icon} {r.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. John Miller"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {role === 'FARMER' && (
            <div className="form-group">
              <label className="form-label">Farm / Business Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Sunny Valley Organic Farm"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{
            backgroundColor: 'var(--primary-50)',
            border: '1px solid var(--border-green)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.825rem',
            color: 'var(--primary-900)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem'
          }}>
            <Info size={16} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            <span>
              <strong>Phase 1 Foundation:</strong> Registration will bind user profile with <strong>Supabase Auth & Spring Security JWT</strong> in subsequent phases.
            </span>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
            <UserPlus size={18} /> Register as {role}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to={`/login?role=${role}`} style={{ color: 'var(--primary-800)', fontWeight: 600 }}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
