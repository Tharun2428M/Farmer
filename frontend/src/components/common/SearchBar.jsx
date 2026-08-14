import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * Reusable Marketplace Search Bar
 */
export const SearchBar = ({
  value,
  onChange,
  onClear,
  onSubmit,
  placeholder = 'Search fresh tomatoes, spinach, organic honey...',
  className = ''
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} className={`search-bar-form ${className}`} style={{ width: '100%' }}>
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%'
      }}>
        <Search
          size={20}
          style={{
            position: 'absolute',
            left: '1rem',
            color: 'var(--primary-700)',
            pointerEvents: 'none'
          }}
        />

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '0.85rem 3rem 0.85rem 2.85rem',
            fontSize: '0.9375rem',
            border: '2px solid var(--border-green)',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-main)',
            boxShadow: 'var(--shadow-sm)',
            outline: 'none',
            transition: 'all var(--transition-fast)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--primary-700)';
            e.target.style.boxShadow = '0 0 0 4px rgba(82, 183, 136, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border-green)';
            e.target.style.boxShadow = 'var(--shadow-sm)';
          }}
        />

        {value && (
          <button
            type="button"
            onClick={onClear}
            style={{
              position: 'absolute',
              right: '1rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              padding: '0.25rem'
            }}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
