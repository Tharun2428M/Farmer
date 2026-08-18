import React from 'react';
import { Calendar } from 'lucide-react';

const AdminDateFilter = ({
  selectedRange = '7_DAYS',
  onRangeChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}) => {
  const presets = [
    { label: 'Today', value: 'TODAY' },
    { label: 'Last 7 Days', value: '7_DAYS' },
    { label: 'Last 30 Days', value: '30_DAYS' },
    { label: 'This Month', value: 'THIS_MONTH' },
    { label: 'Custom', value: 'CUSTOM' }
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      flexWrap: 'wrap',
      backgroundColor: 'var(--bg-surface)',
      padding: '0.35rem 0.5rem',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-light)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0 0.4rem', color: 'var(--text-muted)' }}>
        <Calendar size={15} />
        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Period:</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        {presets.map((p) => {
          const isActive = selectedRange === p.value;
          return (
            <button
              key={p.value}
              onClick={() => onRangeChange(p.value)}
              style={{
                background: isActive ? 'var(--primary-900)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-body)',
                border: 'none',
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {selectedRange === 'CUSTOM' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.5rem' }}>
          <input
            type="date"
            value={startDate || ''}
            onChange={(e) => onStartDateChange && onStartDateChange(e.target.value)}
            className="form-input"
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.78rem', height: '30px' }}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>to</span>
          <input
            type="date"
            value={endDate || ''}
            onChange={(e) => onEndDateChange && onEndDateChange(e.target.value)}
            className="form-input"
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.78rem', height: '30px' }}
          />
        </div>
      )}
    </div>
  );
};

export default AdminDateFilter;
