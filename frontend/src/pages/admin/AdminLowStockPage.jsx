import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import {
  AlertTriangle,
  Package,
  Tractor,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminLowStockPage = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLowStock();
  }, []);

  const fetchLowStock = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getLowStockProducts();
      setLowStockProducts(res || []);
    } catch (err) {
      setError(err.message || 'Failed to load low stock inventory alerts.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626', marginBottom: '0.25rem' }}>
          <AlertTriangle size={18} />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Inventory Alert Center
          </span>
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          Low Stock & Shortage Monitoring
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Real-time alerts for produce inventory reaching or breaching replenishment thresholds.
        </p>
      </div>

      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#991b1b',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--primary-800)' }}>
          <div className="spin" style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid #b7e4c7', borderTopColor: '#2d6a4f', borderRadius: '50%' }} />
          <div style={{ marginTop: '1rem', fontWeight: 600 }}>Scanning Farm Inventory Thresholds...</div>
        </div>
      ) : lowStockProducts.length === 0 ? (
        <div className="admin-card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#ecfdf5',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <CheckCircle2 size={36} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            All Inventory Healthy
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
            No produce is currently below its configured low-stock threshold. Farm inventories are adequately stocked.
          </p>
          <Link to="/admin/products" className="btn btn-outline">
            View All Catalog Products
          </Link>
        </div>
      ) : (
        <div className="admin-card" style={{ padding: '1.25rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-light)'
          }}>
            <div>
              <strong style={{ color: '#dc2626', fontSize: '1rem' }}>
                ⚠️ {lowStockProducts.length} Items Require Immediate Attention
              </strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Contact the listed farmers to replenish harvests or adjust active listings.
              </div>
            </div>
            <button onClick={fetchLowStock} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
              Refresh Stock Levels
            </button>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Produce Title</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Threshold</th>
                  <th>Farmer / Producer</th>
                  <th>Urgent Action</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map((p) => {
                  const isOutOfStock = (p.stockQuantity || 0) <= 0;

                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={p.imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&auto=format&fit=crop&q=60'}
                            alt={p.title}
                            style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{p.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>₹{p.pricePerUnit} / {p.unit}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-category" style={{ fontSize: '0.75rem' }}>
                          {p.categoryName || 'Produce'}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: isOutOfStock ? '#dc2626' : '#d97706' }}>
                          {p.stockQuantity || 0} {p.unit}
                        </div>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: isOutOfStock ? '#991b1b' : '#92400e',
                          backgroundColor: isOutOfStock ? '#fee2e2' : '#fef3c7',
                          padding: '1px 5px',
                          borderRadius: '3px'
                        }}>
                          {isOutOfStock ? 'OUT OF STOCK' : 'CRITICAL LOW'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        ≤ {p.lowStockThreshold || 5} {p.unit}
                      </td>
                      <td>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--primary-800)' }}>
                            🌾 {p.farmName}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Owner: {p.farmerName}
                          </div>
                        </div>
                      </td>
                      <td>
                        <Link
                          to="/admin/products"
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Package size={13} />
                          Manage Listing
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLowStockPage;
