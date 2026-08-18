import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/adminService';
import AdminDataTable from '../../components/admin/AdminDataTable';
import { Truck, Edit3, X, AlertCircle, CheckCircle2, Phone, Calendar, User } from 'lucide-react';

const AdminDeliveriesPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [feedback, setFeedback] = useState(null);

  // Driver Assignment & Dispatch Modal
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    deliveryPersonName: '',
    deliveryPersonPhone: '',
    status: 'ASSIGNED',
    estimatedDeliveryTime: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchDeliveries = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminService.getDeliveries({
        status: statusFilter || undefined,
        query: search || undefined,
        page,
        size: 10
      });
      setDeliveries(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load delivery dispatches.' });
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const handleOpenModal = (del) => {
    setSelectedDelivery(del);
    setFormData({
      deliveryPersonName: del.deliveryPersonName || '',
      deliveryPersonPhone: del.deliveryPersonPhone || '',
      status: del.status || 'PENDING',
      estimatedDeliveryTime: del.estimatedDeliveryTime ? del.estimatedDeliveryTime.slice(0, 16) : ''
    });
    setModalOpen(true);
    setFeedback(null);
  };

  const handleSaveDispatch = async (e) => {
    e.preventDefault();
    if (!selectedDelivery) return;

    try {
      setSubmitting(true);
      await adminService.updateDelivery(selectedDelivery.id, {
        ...formData,
        estimatedDeliveryTime: formData.estimatedDeliveryTime ? new Date(formData.estimatedDeliveryTime).toISOString() : null
      });
      setFeedback({ type: 'success', message: 'Delivery assignment and dispatch updated successfully.' });
      setModalOpen(false);
      fetchDeliveries();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update delivery.' });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Order Ref',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 800, color: 'var(--primary-800)', fontSize: '0.875rem' }}>
            #{row.orderId ? row.orderId.substring(0, 8) : 'N/A'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Dispatch ID: {row.id.substring(0, 8)}
          </div>
        </div>
      )
    },
    {
      header: 'Delivery Driver',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.875rem' }}>
            {row.deliveryPersonName || 'Unassigned Driver'}
          </div>
          {row.deliveryPersonPhone && (
            <div style={{ fontSize: '0.78rem', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Phone size={12} /> {row.deliveryPersonPhone}
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Dispatch Status',
      render: (row) => {
        let badgeClass = 'admin-badge-pending';
        if (row.status === 'DELIVERED') badgeClass = 'admin-badge-active';
        else if (row.status === 'OUT_FOR_DELIVERY') badgeClass = 'admin-badge-paid';
        else if (row.status === 'FAILED') badgeClass = 'admin-badge-failed';
        return <span className={`admin-badge ${badgeClass}`}>{row.status}</span>;
      }
    },
    {
      header: 'ETA / Completed',
      render: (row) => (
        <div style={{ fontSize: '0.8rem' }}>
          {row.actualDeliveryTime ? (
            <div style={{ color: '#059669', fontWeight: 600 }}>
              Delivered: {new Date(row.actualDeliveryTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </div>
          ) : row.estimatedDeliveryTime ? (
            <div style={{ color: 'var(--text-muted)' }}>
              ETA: {new Date(row.estimatedDeliveryTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </div>
          ) : (
            <span style={{ color: 'var(--text-light)' }}>Not scheduled</span>
          )}
        </div>
      )
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <button
          onClick={() => handleOpenModal(row)}
          className="btn btn-outline"
          style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          <Edit3 size={13} />
          Assign & Dispatch
        </button>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Delivery & Dispatch Operations
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Assign delivery drivers, track farm-to-door transit, update estimated arrival times, and finalize dispatches.
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
        data={deliveries}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={setPage}
        searchQuery={search}
        onSearchChange={(val) => { setSearch(val); setPage(0); }}
        searchPlaceholder="Search driver name, phone..."
        filters={
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            className="form-input"
            style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.82rem', height: '40px' }}
          >
            <option value="">All Delivery Statuses</option>
            <option value="PENDING">Pending Assignment</option>
            <option value="ASSIGNED">Assigned to Driver</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="FAILED">Failed / Reschedule</option>
          </select>
        }
      />

      {/* Dispatch Modal */}
      {modalOpen && selectedDelivery && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>
                Delivery Dispatch for Order #{selectedDelivery.orderId ? selectedDelivery.orderId.substring(0, 8) : ''}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDispatch}>
              <div className="admin-modal-body">
                <div className="form-group">
                  <label className="form-label">Delivery Person Name</label>
                  <input
                    type="text"
                    value={formData.deliveryPersonName}
                    onChange={(e) => setFormData({ ...formData, deliveryPersonName: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Driver Phone Number</label>
                  <input
                    type="text"
                    value={formData.deliveryPersonPhone}
                    onChange={(e) => setFormData({ ...formData, deliveryPersonPhone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Estimated Delivery Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formData.estimatedDeliveryTime}
                    onChange={(e) => setFormData({ ...formData, estimatedDeliveryTime: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Dispatch Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="form-input"
                  >
                    <option value="PENDING">PENDING (Awaiting Driver)</option>
                    <option value="ASSIGNED">ASSIGNED (Driver Notified)</option>
                    <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY (Transit)</option>
                    <option value="DELIVERED">DELIVERED (Fulfilled)</option>
                    <option value="FAILED">FAILED (Delivery Issue)</option>
                  </select>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Updating...' : 'Save Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDeliveriesPage;
