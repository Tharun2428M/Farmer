import React from 'react';
import { Loader2, Sprout } from 'lucide-react';

/**
 * Reusable Loading Spinner Component
 */
export const LoadingSpinner = ({
  message = 'Loading fresh produce from local farms...',
  size = 'md',
  fullScreen = false
}) => {
  const iconSize = size === 'sm' ? 24 : size === 'lg' ? 48 : 36;

  const content = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      padding: '3rem 1.5rem',
      textAlign: 'center'
    }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2
          size={iconSize}
          color="var(--primary-700)"
          style={{ animation: 'spin 1.2s linear infinite' }}
        />
        <Sprout
          size={iconSize * 0.5}
          color="var(--primary-600)"
          style={{ position: 'absolute' }}
        />
      </div>

      {message && (
        <p style={{ fontSize: '0.9375rem', fontWeight: '500', color: 'var(--text-muted)' }}>
          {message}
        </p>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999
      }}>
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
