import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/adminService';
import AdminDataTable from '../../components/admin/AdminDataTable';
import {
  Tractor,
  Star,
  Package,
  ShoppingBag,
  MapPin,
  Eye,
  Edit3,
  X,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
  Loader2
} from 'lucide-react';

const AdminFarmersPage = () => {
  const [farmers, setFarmers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState(null);

  // Inspector Modal State
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [inspectFarmer, setInspectFarmer] = useState(null);
  const [inspectTab, setInspectTab] = useState('products');
  const [farmerProducts, setFarmerProducts] = useState([]);
  const [farmerOrders, setFarmerOrders] = useState([]);
  const [inspectLoading, setInspectLoading] = useState(false);

  // Status Modal State
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [newStatus, setNewStatus] = useState('ACTIVE');
  const [submitting, setSubmitting] = useState(false);

  const fetchFarmers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminService.getFarmers({
        query: search || undefined,
        page,
        size: 10
      });
      setFarmers(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load farmers directory.' });
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchFarmers();
  }, [fetchFarmers]);

  const handleInspect = async (farmer) => {
    setInspectFarmer(farmer);
    setInspectModalOpen(true);
    setInspectTab('products');
    setInspectLoading(true);
    try {
      const [prods, ords] = await Promise.all([
        adminService.getFarmerProducts(farmer.id),
        adminService.getFarmerOrders(farmer.id)
      ]);
      setFarmerProducts(prods || []);
      setFarmerOrders(ords || []);
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to load farmer detailed catalog and orders.' });
    } finally {
      setInspectLoading(false);
    }
  };

  const handleOpenStatusModal = (farmer) => {
    setSelectedFarmer(farmer);
    setNewStatus(farmer.status || 'ACTIVE');
    setStatusModalOpen(true);
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!selectedFarmer) return;

    try {
      setSubmitting(true);
      await adminService.updateFarmerStatus(selectedFarmer.id, newStatus);
      setFeedback({ type: 'success', message: `Farmer status updated to ${newStatus}` });
      setStatusModalOpen(false);
      fetchFarmers();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update farmer status.' });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Farm & Producer',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
            🌾 {row.farmName || 'Agro Farm'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Owner: {row.name || 'N/A'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            <MapPin size={12} color="var(--primary-800)" />
            {row.farmAddress || 'Location specified'}
          </div>
        </div>
      )
    },
    {
      header: 'Contact',
      render: (row) => (
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Mail size={12} /> {row.email}
          </div>
          {row.phone && (
            <div style={{ fontSize: '0.78rem', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <Phone size={12} /> {row.phone}
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Catalog & Orders',
      render: (row) => (
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {row.totalProducts || 0} produce items
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {row.totalOrders || 0} total sales
          </div>
        </div>
      )
    },
    {
      header: 'Rating',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Star size={14} fill="#f59e0b" color="#f59e0b" />
          <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
            {row.rating ? Number(row.rating).toFixed(1) : '5.0'}
          </strong>
        </div>
      )
    },
    {
      header: 'Status',
      render: (row) => {
        const s = (row.status || 'ACTIVE').toUpperCase();
        let badgeClass = 'admin-badge-active';
        if (s === 'SUSPENDED') badgeClass = 'admin-badge-suspended';
        else if (s === 'INACTIVE') badgeClass = 'admin-badge-inactive';
        return <span className={`admin-badge ${badgeClass}`}>{s}</span>;
      }
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
          <button
            onClick={() => handleInspect(row)}
            className="btn btn-outline"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Eye size={13} />
            Inspect
          </button>
          <button
            onClick={() => handleOpenStatusModal(row)}
            className="btn btn-outline"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Edit3 size={13} />
            Status
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Farmers & Producers Directory
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Verify registered regional farms, inspect product listings, monitor fulfillment, and moderate status.
          </p>
        </div>
      </div>

      {feedback && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1rem',
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

      <AdminDataTable
        columns={columns}
        data={farmers}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={setPage}
        searchQuery={search}
        onSearchChange={(val) => { setSearch(val); setPage(0); }}
        searchPlaceholder="Search farm name, owner, email, address..."
      />

      {/* Inspect Farmer Modal */}
      {inspectModalOpen && inspectFarmer && (
        <div className="admin-modal-overlay" onClick={() => setInspectModalOpen(false)}>
          <div className="admin-modal" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>
                  🌾 {inspectFarmer.farmName}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Owner: {inspectFarmer.name} ({inspectFarmer.email})
                </div>
              </div>
              <button
                onClick={() => setInspectModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal-body">
              {/* Tab Selector */}
              <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1rem', paddingBottom: '0.5rem' }}>
                <button
                  onClick={() => setInspectTab('products')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.85rem',
                    fontWeight: inspectTab === 'products' ? 700 : 500,
                    color: inspectTab === 'products' ? 'var(--primary-800)' : 'var(--text-muted)',
                    borderBottom: inspectTab === 'products' ? '2px solid var(--primary-800)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  Produce Catalog ({farmerProducts.length})
                </button>
                <button
                  onClick={() => setInspectTab('orders')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.85rem',
                    fontWeight: inspectTab === 'orders' ? 700 : 500,
                    color: inspectTab === 'orders' ? 'var(--primary-800)' : 'var(--text-muted)',
                    borderBottom: inspectTab === 'orders' ? '2px solid var(--primary-800)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  Order Sales ({farmerOrders.length})
                </button>
              </div>

              {inspectLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <Loader2 size={24} className="spin" />
                  <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>Loading details...</div>
                </div>
              ) : inspectTab === 'products' ? (
                farmerProducts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No products listed by this farmer yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {farmerProducts.map((p) => (
                      <div
                        key={p.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-light)',
                          backgroundColor: '#f8faf9'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={p.imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&auto=format&fit=crop&q=60'}
                            alt={p.title}
                            style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{p.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Category: {p.categoryName} | Stock: {p.stockQuantity} {p.unit}
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, color: 'var(--primary-800)' }}>₹{p.pricePerUnit} / {p.unit}</div>
                          <span className={`admin-badge ${p.isActive ? 'admin-badge-active' : 'admin-badge-inactive'}`}>
                            {p.isActive ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                farmerOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No orders associated with this farm yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {farmerOrders.map((o) => (
                      <div
                        key={o.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-light)',
                          backgroundColor: '#f8faf9'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Order #{o.id.substring(0, 8)}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Customer: {o.customerName || 'Consumer'} | {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ''}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>₹{o.totalAmount}</div>
                          <span className="admin-badge admin-badge-active">{o.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setInspectModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Moderate Status Modal */}
      {statusModalOpen && selectedFarmer && (
        <div className="admin-modal-overlay" onClick={() => setStatusModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>
                Moderate Farmer Account
              </h3>
              <button
                onClick={() => setStatusModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveStatus}>
              <div className="admin-modal-body">
                <div style={{ backgroundColor: '#f8faf9', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{selectedFarmer.farmName}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{selectedFarmer.email}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--primary-800)', marginTop: '0.25rem' }}>
                    Current Status: <strong>{selectedFarmer.status}</strong>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Set Account Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="form-input"
                  >
                    <option value="ACTIVE">ACTIVE (Can List Produce & Receive Orders)</option>
                    <option value="INACTIVE">INACTIVE (Temporarily Hidden from Storefront)</option>
                    <option value="SUSPENDED">SUSPENDED (Blocked from Farm Portal)</option>
                  </select>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setStatusModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Updating...' : 'Save Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFarmersPage;
