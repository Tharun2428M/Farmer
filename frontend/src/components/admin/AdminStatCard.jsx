import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const colorMap = {
  emerald: {
    bg: '#ecfdf5',
    text: '#065f46',
    border: '#a7f3d0',
    accent: '#10b981'
  },
  blue: {
    bg: '#eff6ff',
    text: '#1e40af',
    border: '#bfdbfe',
    accent: '#3b82f6'
  },
  amber: {
    bg: '#fffbeb',
    text: '#92400e',
    border: '#fde68a',
    accent: '#f59e0b'
  },
  rose: {
    bg: '#fff1f2',
    text: '#9f1239',
    border: '#fecdd3',
    accent: '#f43f5e'
  },
  purple: {
    bg: '#faf5ff',
    text: '#6b21a8',
    border: '#e9d5ff',
    accent: '#a855f7'
  },
  indigo: {
    bg: '#eef2ff',
    text: '#3730a3',
    border: '#c7d2fe',
    accent: '#6366f1'
  }
};

const AdminStatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel = 'vs last month',
  colorScheme = 'emerald',
  subtitle,
  onClick
}) => {
  const theme = colorMap[colorScheme] || colorMap.emerald;

  return (
    <div
      onClick={onClick}
      className="admin-stat-widget"
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all var(--transition-fast)'
      }}
    >
      <div style={{ flex: 1, marginRight: '1rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
          {title}
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '0.5rem' }}>
          {value}
        </div>

        {trend !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontWeight: 700,
              color: trend >= 0 ? '#10b981' : '#ef4444',
              backgroundColor: trend >= 0 ? '#ecfdf5' : '#fef2f2',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {Math.abs(trend)}%
            </span>
            <span style={{ color: 'var(--text-muted)' }}>{trendLabel}</span>
          </div>
        )}

        {subtitle && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {subtitle}
          </div>
        )}
      </div>

      {Icon && (
        <div
          className="admin-stat-icon"
          style={{
            backgroundColor: theme.bg,
            color: theme.text,
            border: `1px solid ${theme.border}`
          }}
        >
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};

export default AdminStatCard;
