import React from 'react';
import { PackageOpen } from 'lucide-react';
import Button from './Button';

/**
 * Reusable Empty State Component
 */
export const EmptyState = ({
  icon,
  title = 'No products found',
  message = 'Try changing your search keywords or resetting active category filters.',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`empty-state-card card ${className}`} style={{
      padding: '3.5rem 1.5rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      maxWidth: '520px',
      margin: '2rem auto'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--primary-100)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--primary-800)',
        marginBottom: '1.25rem'
      }}>
        {icon || <PackageOpen size={32} />}
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
        {title}
      </h3>

      <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: actionLabel ? '1.5rem' : '0' }}>
        {message}
      </p>

      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
