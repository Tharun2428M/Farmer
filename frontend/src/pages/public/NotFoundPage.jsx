import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ArrowLeft, Home } from 'lucide-react';
import Button from '../../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-app)',
      minHeight: '70vh',
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
        borderRadius: 'var(--radius-xl)'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--primary-100)',
          color: 'var(--primary-800)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <Sprout size={36} />
        </div>

        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--primary-900)', lineHeight: '1', marginBottom: '0.75rem' }}>
          404
        </h1>

        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
          Crop Page Not Found
        </h2>

        <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
          The page or farm produce listing you are looking for may have been moved, harvested, or does not exist.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Link to="/">
            <Button variant="primary" icon={<Home size={16} />}>
              Back to Home
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline">
              Browse Produce
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
