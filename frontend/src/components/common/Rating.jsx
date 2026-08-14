import React from 'react';
import { Star } from 'lucide-react';

/**
 * Reusable Rating Component
 */
export const Rating = ({
  value = 5,
  count,
  size = 15,
  showNumeric = true,
  className = ''
}) => {
  const numericRating = Number(value) || 0;

  return (
    <div className={`rating-wrapper ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', color: '#f59e0b' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            fill={star <= Math.round(numericRating) ? '#f59e0b' : 'none'}
            stroke="#f59e0b"
            strokeWidth={1.5}
          />
        ))}
      </div>

      {showNumeric && (
        <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-main)', marginLeft: '0.2rem' }}>
          {numericRating.toFixed(1)}
        </span>
      )}

      {count !== undefined && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          ({count})
        </span>
      )}
    </div>
  );
};

export default Rating;
