import React from 'react';

/**
 * Reusable Badge Component
 * Props:
 * - variant: 'organic' | 'instock' | 'lowstock' | 'category' | 'neutral'
 */
export const Badge = ({ children, variant = 'category', icon, className = '' }) => {
  return (
    <span className={`badge badge-${variant} ${className}`.trim()}>
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
