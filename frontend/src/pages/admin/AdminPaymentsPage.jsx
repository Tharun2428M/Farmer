import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/adminService';
import AdminDataTable from '../../components/admin/AdminDataTable';
import { CreditCard, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [feedback, setFeedback] = useState(null);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminService.getPayments({
        status: statusFilter || undefined,
        method: methodFilter || undefined,
        query: search || undefined,
        page,
        size: 10
      });
      setPayments(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load payments ledger.' });
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, methodFilter, search]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const columns = [
    {
      header: 'Transaction Reference',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.875rem' }}>
            {row.transactionReference || 'N/A'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Payment ID: {row.id.substring(0, 8)}
          </div>
        </div>
      )
    },
    {
      header: 'Order Ref',
      render: (row) => (
        <span style={{ fontWeight: 600, color: 'var(--primary-800)', fontSize: '0.85rem' }}>
          #{row.orderId ? row.orderId.substring(0, 8) : 'N/A'}
        </span>
      )
    },
    {
      header: 'Amount',
      render: (row) => (
        <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem' }}>
          ₹{row.amount}
        </div>
      )
    },
    {
      header: 'Payment Method',
      render: (row) => (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '2px 8px',
          borderRadius: '4px',
          backgroundColor: '#f3f4f6',
          color: '#374151',
          fontSize: '0.75rem',
          fontWeight: 700
        }}>
          <CreditCard size={12} />
          {row.paymentMethod}
        </span>
      )
    },
    {
      header: 'Status',
      render: (row) => {
        let badgeClass = 'admin-badge-pending';
        if (row.status === 'SUCCESS') badgeClass = 'admin-badge-paid';
        else if (row.status === 'FAILED') badgeClass = 'admin-badge-failed';
        return <span className={`admin-badge ${badgeClass}`}>{row.status}</span>;
      }
    },
    {
      header: 'Timestamp',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
        </span>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Payment & Financial Audit Ledger
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Monitor online transactions, UPI gateway payments, Cash on Delivery receipts, and reconciliation records.
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
        data={payments}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={setPage}
        searchQuery={search}
        onSearchChange={(val) => { setSearch(val); setPage(0); }}
        searchPlaceholder="Search by transaction reference..."
        filters={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              className="form-input"
              style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.82rem', height: '40px' }}
            >
              <option value="">All Payment Statuses</option>
              <option value="SUCCESS">Success / Paid</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>

            <select
              value={methodFilter}
              onChange={(e) => { setMethodFilter(e.target.value); setPage(0); }}
              className="form-input"
              style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.82rem', height: '40px' }}
            >
              <option value="">All Payment Methods</option>
              <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
              <option value="ONLINE_CARD">Online Card</option>
              <option value="UPI">UPI Payment</option>
            </select>
          </div>
        }
      />
    </div>
  );
};

export default AdminPaymentsPage;
