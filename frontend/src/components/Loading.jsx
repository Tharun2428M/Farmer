import React from 'react';

export const Loading = ({ message = 'Loading fresh data...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1rem',
      minHeight: '200px'
    }}>
      <div style={{
        width: '42px',
        height: '42px',
        border: '4px solid var(--primary-100)',
        borderTop: '4px solid var(--primary-800)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>
        {message}
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loading;
