import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';

export const UnauthorizedPage = () => {
  const { user, role } = useAuth();

  const getDashboardPath = () => {
    if (role === 'CUSTOMER') return '/customer/dashboard';
    if (role === 'FARMER') return '/farmer/dashboard';
    if (role === 'ADMIN') return '/admin/dashboard';
    return '/';
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-app)',
      minHeight: '75vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1.5rem',
      textAlign: 'center'
    }}>
      <div className="card" style={{
        maxWidth: '520px',
        padding: '3.5rem 2rem',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: '#fee2e2',
          color: '#b91c1c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <ShieldAlert size={36} />
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-900)', marginBottom: '0.75rem' }}>
          403 — Access Denied
        </h1>

        <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', marginBottom: '1.75rem', lineHeight: '1.6' }}>
          You do not have the required permissions to view this protected page.
          {role && (
            <span style={{ display: 'block', marginTop: '0.5rem' }}>
              Current signed-in role: <strong style={{ color: 'var(--primary-800)' }}>{role}</strong>
            </span>
          )}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {role && (
            <Link to={getDashboardPath()}>
              <Button variant="primary">
                Go to My {role} Dashboard
              </Button>
            </Link>
          )}
          <Link to="/">
            <Button variant="outline" icon={<Home size={16} />}>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
