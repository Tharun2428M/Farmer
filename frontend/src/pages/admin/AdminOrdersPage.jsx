import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/adminService';
import AdminDataTable from '../../components/admin/AdminDataTable';
import {
  ShoppingBag,
  Eye,
  Edit3,
  X,
  AlertCircle,
  CheckCircle2,
  Truck,
  CreditCard,
  User,
  MapPin,
  Clock
} from 'lucide-react';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [feedback, setFeedback] = useState(null);

  // Inspector & Status Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('PENDING');
  const [submitting, setSubmitting] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminService.getOrders({
        status: statusFilter || undefined,
        paymentStatus: paymentStatusFilter || undefined,
        page,
        size: 10
      });
      setOrders(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load platform orders.' });
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, paymentStatusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status || 'PENDING');
    setModalOpen(true);
    setFeedback(null);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      setSubmitting(true);
      await adminService.updateOrderStatus(selectedOrder.id, newStatus);
      setFeedback({ type: 'success', message: `Order #${selectedOrder.id.substring(0, 8)} status updated to ${newStatus}` });
      setModalOpen(false);
      fetchOrders();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update order status.' });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Order Reference',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>
            #{row.id.substring(0, 8)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
          </div>
        </div>
      )
    },
    {
      header: 'Customer',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>
            {row.customerName || 'Direct Consumer'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {row.deliveryAddress ? `${row.deliveryAddress.city}, ${row.deliveryAddress.state}` : 'Home Delivery'}
          </div>
        </div>
      )
    },
    {
      header: 'Amount',
      render: (row) => (
        <div style={{ fontWeight: 800, color: 'var(--primary-800)', fontSize: '0.95rem' }}>
          ₹{row.totalAmount}
        </div>
      )
    },
    {
      header: 'Order Status',
      render: (row) => {
        let badgeClass = 'admin-badge-pending';
        if (row.status === 'DELIVERED') badgeClass = 'admin-badge-active';
        else if (row.status === 'CANCELLED') badgeClass = 'admin-badge-failed';
        return <span className={`admin-badge ${badgeClass}`}>{row.status}</span>;
      }
    },
    {
      header: 'Payment',
      render: (row) => {
        let badgeClass = 'admin-badge-pending';
        if (row.paymentStatus === 'PAID') badgeClass = 'admin-badge-paid';
        else if (row.paymentStatus === 'FAILED' || row.paymentStatus === 'REFUNDED') badgeClass = 'admin-badge-failed';
        return (
          <div>
            <span className={`admin-badge ${badgeClass}`}>{row.paymentStatus}</span>
            {row.paymentMethod && (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {row.paymentMethod}
              </div>
            )}
          </div>
        );
      }
    },
    {
      header: 'Delivery Agent',
      render: (row) => {
        if (!row.delivery) return <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Unassigned</span>;
        return (
          <div style={{ fontSize: '0.8rem' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{row.delivery.deliveryPersonName || 'Pending Driver'}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--primary-800)' }}>{row.delivery.status}</div>
          </div>
        );
      }
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
          <Eye size={13} />
          Details & Status
        </button>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Orders & Fulfillment
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Manage platform order flow, track farm dispatch, audit invoices, and control fulfillment state.
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
        data={orders}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={setPage}
        filters={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              className="form-input"
              style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.82rem', height: '40px' }}
            >
              <option value="">All Order Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <select
              value={paymentStatusFilter}
              onChange={(e) => { setPaymentStatusFilter(e.target.value); setPage(0); }}
              className="form-input"
              style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.82rem', height: '40px' }}
            >
              <option value="">All Payments</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
        }
      />

      {/* Order Details & Status Modal */}
      {modalOpen && selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>
                  Order #{selectedOrder.id.substring(0, 8)}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Total: ₹{selectedOrder.totalAmount} | Current Status: {selectedOrder.status}
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus}>
              <div className="admin-modal-body">
                {/* Items Breakdown */}
                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                      Ordered Produce
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {selectedOrder.items.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.5rem 0.75rem',
                            backgroundColor: '#f8faf9',
                            borderRadius: '6px',
                            fontSize: '0.85rem'
                          }}
                        >
                          <div>
                            <strong>{item.productTitle}</strong> ({item.farmerFarmName || 'Farm'})
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {item.quantity} × ₹{item.unitPrice}
                            </div>
                          </div>
                          <strong style={{ color: 'var(--primary-800)' }}>₹{item.subtotal}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Delivery Address */}
                {selectedOrder.deliveryAddress && (
                  <div style={{ backgroundColor: '#f8faf9', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.82rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                      <MapPin size={14} color="var(--primary-800)" /> Shipping Address
                    </div>
                    <div>{selectedOrder.deliveryAddress.streetAddress}, {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} - {selectedOrder.deliveryAddress.postalCode}</div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Update Order Fulfillment Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="form-input"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PROCESSING">PROCESSING (Harvesting / Packing)</option>
                    <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY (En Route)</option>
                    <option value="DELIVERED">DELIVERED (Completed)</option>
                    <option value="CANCELLED">CANCELLED (Void)</option>
                  </select>
                  <p className="form-hint" style={{ marginTop: '0.35rem' }}>
                    Setting status to DELIVERED automatically marks Cash on Delivery as PAID and records fulfillment completion.
                  </p>
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
                  {submitting ? 'Updating...' : 'Save Order Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
