import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const Error = ({ title = 'Something went wrong', message, onRetry }) => {
  return (
    <div style={{
      maxWidth: '500px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: 'var(--radius-lg)',
      textAlign: 'center',
      color: '#991b1b'
    }}>
      <AlertTriangle style={{ width: '48px', height: '48px', color: '#dc2626', marginBottom: '1rem' }} />
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: '#7f1d1d', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
        {message || 'Unable to connect to the marketplace server. Please verify your connection or backend server state.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn"
          style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
        >
          <RefreshCw style={{ width: '16px', height: '16px' }} /> Retry Connection
        </button>
      )}
    </div>
  );
};

export default Error;
