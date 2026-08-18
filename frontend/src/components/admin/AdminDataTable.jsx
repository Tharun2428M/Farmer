import React from 'react';
import { Search, ChevronLeft, ChevronRight, Inbox, Loader2 } from 'lucide-react';

const AdminDataTable = ({
  columns = [],
  data = [],
  loading = false,
  page = 0,
  totalPages = 1,
  totalElements = 0,
  onPageChange,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filters,
  actions,
  emptyMessage = 'No records found matching your filters.',
  emptyIcon: EmptyIcon = Inbox
}) => {
  return (
    <div className="admin-card" style={{ padding: '1.25rem' }}>
      {/* Search and Filters Header */}
      {(onSearchChange || filters || actions) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '260px' }}>
            {onSearchChange && (
              <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={searchQuery || ''}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="form-input"
                  style={{ paddingLeft: '36px', height: '40px', fontSize: '0.875rem' }}
                />
              </div>
            )}
            {filters}
          </div>

          {actions && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Table Content */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} style={{ textAlign: col.align || 'left', width: col.width || 'auto' }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', color: 'var(--primary-800)' }}>
                    <Loader2 size={32} className="spin" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Loading platform data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <EmptyIcon size={40} strokeWidth={1.5} color="var(--text-light)" />
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.5rem' }}>
                      {emptyMessage}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr key={row.id || rowIdx}>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} style={{ textAlign: col.align || 'left' }}>
                      {col.render ? col.render(row, rowIdx) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!loading && totalPages > 1 && onPageChange && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 0.5rem 0.25rem',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            Showing page <strong style={{ color: 'var(--text-main)' }}>{page + 1}</strong> of <strong style={{ color: 'var(--text-main)' }}>{totalPages}</strong> ({totalElements} total entries)
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.4rem 0.75rem',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: page === 0 ? '#f3f4f6' : '#ffffff',
                color: page === 0 ? '#9ca3af' : 'var(--text-main)',
                cursor: page === 0 ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '0.8rem'
              }}
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages - 1}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.4rem 0.75rem',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: page >= totalPages - 1 ? '#f3f4f6' : '#ffffff',
                color: page >= totalPages - 1 ? '#9ca3af' : 'var(--text-main)',
                cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '0.8rem'
              }}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDataTable;
