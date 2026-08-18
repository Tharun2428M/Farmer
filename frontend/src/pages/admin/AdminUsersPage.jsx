import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/adminService';
import AdminDataTable from '../../components/admin/AdminDataTable';
import useAuth from '../../hooks/useAuth';
import { Users, Shield, UserCheck, UserX, AlertCircle, CheckCircle2, Edit3, X } from 'lucide-react';

const AdminUsersPage = () => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [newStatus, setNewStatus] = useState('ACTIVE');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsers({
        role: roleFilter || undefined,
        status: statusFilter || undefined,
        query: search || undefined,
        page,
        size: 10
      });
      setUsers(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load users' });
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, statusFilter, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenStatusModal = (user) => {
    setSelectedUser(user);
    setNewStatus(user.status || 'ACTIVE');
    setModalOpen(true);
    setFeedback(null);
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (selectedUser.id === currentAdmin?.id && newStatus !== 'ACTIVE') {
      setFeedback({ type: 'error', message: 'You cannot deactivate or suspend your own administrator account.' });
      return;
    }

    try {
      setSubmitting(true);
      await adminService.updateUserStatus(selectedUser.id, newStatus);
      setFeedback({ type: 'success', message: `User status updated to ${newStatus}` });
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update user status.' });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'User / Contact',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{row.name || 'Anonymous User'}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{row.email}</div>
          {row.phone && <div style={{ fontSize: '0.75rem', color: 'var(--primary-800)' }}>📞 {row.phone}</div>}
        </div>
      )
    },
    {
      header: 'Role',
      render: (row) => {
        let badgeColor = '#f3f4f6';
        let textColor = '#374151';
        if (row.role === 'ADMIN') {
          badgeColor = '#fee2e2';
          textColor = '#991b1b';
        } else if (row.role === 'FARMER') {
          badgeColor = '#fef3c7';
          textColor = '#92400e';
        } else if (row.role === 'CUSTOMER') {
          badgeColor = '#ecfdf5';
          textColor = '#065f46';
        }
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: badgeColor,
            color: textColor,
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: 700,
            fontSize: '0.75rem'
          }}>
            {row.role === 'ADMIN' && <Shield size={12} />}
            {row.role}
          </span>
        );
      }
    },
    {
      header: 'Profile Info',
      render: (row) => {
        if (row.role === 'FARMER') {
          return (
            <div>
              <strong style={{ fontSize: '0.82rem', color: 'var(--primary-800)' }}>🌾 {row.farmName || 'Agro Farm'}</strong>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.farmAddress || 'Location set'}</div>
            </div>
          );
        }
        return <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Customer Profile</span>;
      }
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
      header: 'Joined',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
        </span>
      )
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <button
          onClick={() => handleOpenStatusModal(row)}
          className="btn btn-outline"
          style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          <Edit3 size={13} />
          Moderate
        </button>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            User Management & Access Control
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Monitor and moderate registered customers, farmers, and administrative accounts.
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
        data={users}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={setPage}
        searchQuery={search}
        onSearchChange={(val) => { setSearch(val); setPage(0); }}
        searchPlaceholder="Search by name, email, phone..."
        filters={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(0); }}
              className="form-input"
              style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.82rem', height: '40px' }}
            >
              <option value="">All Roles</option>
              <option value="CUSTOMER">Customers</option>
              <option value="FARMER">Farmers</option>
              <option value="ADMIN">Admins</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              className="form-input"
              style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.82rem', height: '40px' }}
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        }
      />

      {/* Moderate Status Modal */}
      {modalOpen && selectedUser && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>
                Moderate User Account
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveStatus}>
              <div className="admin-modal-body">
                <div style={{ backgroundColor: '#f8faf9', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{selectedUser.name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{selectedUser.email}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--primary-800)', marginTop: '0.25rem' }}>
                    Role: <strong>{selectedUser.role}</strong> | Current Status: <strong>{selectedUser.status}</strong>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Set Account Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="form-input"
                  >
                    <option value="ACTIVE">ACTIVE (Full Platform Access)</option>
                    <option value="INACTIVE">INACTIVE (Deactivated / Dormant)</option>
                    <option value="SUSPENDED">SUSPENDED (Blocked from Login & Orders)</option>
                  </select>
                  <p className="form-hint" style={{ marginTop: '0.35rem' }}>
                    Suspended users cannot log in or place orders.
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

export default AdminUsersPage;
