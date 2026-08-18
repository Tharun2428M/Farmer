import React, { useState } from 'react';
import adminService from '../../services/adminService';
import {
  FileSpreadsheet,
  Download,
  ShoppingBag,
  Package,
  Tractor,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

const AdminReportsPage = () => {
  const [downloading, setDownloading] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleDownload = async (type, name) => {
    try {
      setDownloading(type);
      setFeedback(null);
      await adminService.exportCsvReport(type);
      setFeedback({ type: 'success', message: `${name} CSV exported successfully!` });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || `Failed to export ${name}.` });
    } finally {
      setDownloading(null);
    }
  };

  const reports = [
    {
      type: 'orders',
      title: 'Orders & Sales Transactions Report',
      description: 'Complete breakdown of all customer orders, itemized totals, payment statuses, and fulfillment dispatches.',
      icon: ShoppingBag,
      color: '#3b82f6',
      fields: ['Order ID', 'Customer Name', 'Customer Email', 'Total (INR)', 'Order Status', 'Payment Status', 'Delivery Status', 'Date']
    },
    {
      type: 'products',
      title: 'Produce Catalog & Inventory Report',
      description: 'All active and inactive crops, pricing per unit, categorized taxonomies, and live inventory thresholds.',
      icon: Package,
      color: '#10b981',
      fields: ['Product ID', 'Produce Title', 'Category', 'Farm Name', 'Price (INR)', 'Unit', 'Stock Quantity', 'Threshold', 'Status']
    },
    {
      type: 'farmers',
      title: 'Farmers Directory & Operations Report',
      description: 'Registered grower profiles, farm locations, contact numbers, quality ratings, and verification statuses.',
      icon: Tractor,
      color: '#f59e0b',
      fields: ['Farmer ID', 'Farm Name', 'Owner Name', 'Email', 'Phone', 'Rating', 'Address', 'Status']
    },
    {
      type: 'customers',
      title: 'Registered Consumers & Buyers Report',
      description: 'Customer account directory, registration timestamps, verified phone numbers, and moderation statuses.',
      icon: Users,
      color: '#6366f1',
      fields: ['Customer ID', 'Full Name', 'Email', 'Phone', 'Status', 'Registration Date']
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          Reports & CSV Data Exports
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Generate standardized RFC 4180 CSV exports for bookkeeping, external audit, inventory reviews, and tax reporting.
        </p>
      </div>

      {feedback && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: feedback.type === 'error' ? '#fef2f2' : '#ecfdf5',
          color: feedback.type === 'error' ? '#991b1b' : '#065f46',
          border: `1px solid ${feedback.type === 'error' ? '#fecaca' : '#a7f3d0'}`
        }}>
          {feedback.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{feedback.message}</span>
        </div>
      )}

      {/* Reports Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {reports.map((r) => {
          const Icon = r.icon;
          const isDownloading = downloading === r.type;

          return (
            <div key={r.type} className="admin-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    backgroundColor: `${r.color}15`,
                    color: r.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                      {r.title}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                      RFC 4180 CSV
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {r.description}
                </p>

                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Included Export Fields:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {r.fields.map((f, i) => (
                      <span
                        key={i}
                        style={{
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          fontSize: '0.72rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 500
                        }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                <button
                  onClick={() => handleDownload(r.type, r.title)}
                  disabled={isDownloading}
                  className="btn btn-primary"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  {isDownloading ? (
                    <>
                      <Loader2 size={16} className="spin" />
                      <span>Generating Export...</span>
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      <span>Download {r.type.toUpperCase()} CSV</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminReportsPage;
