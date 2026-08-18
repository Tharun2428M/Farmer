import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/adminService';
import AdminDataTable from '../../components/admin/AdminDataTable';
import { Package, Trash2, AlertCircle, CheckCircle2, AlertTriangle, Layers, Tractor } from 'lucide-react';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCategories = async () => {
    try {
      const cats = await adminService.getCategories();
      setCategories(cats || []);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminService.getProducts({
        categoryId: categoryFilter || undefined,
        isActive: activeFilter !== '' ? activeFilter === 'true' : undefined,
        query: search || undefined,
        page,
        size: 10
      });
      setProducts(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load platform products.' });
    } finally {
      setLoading(false);
    }
  }, [page, categoryFilter, activeFilter, search]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleToggleStatus = async (product) => {
    try {
      const nextStatus = !product.isActive;
      await adminService.setProductStatus(product.id, nextStatus);
      setFeedback({ type: 'success', message: `Product '${product.title}' is now ${nextStatus ? 'ACTIVE' : 'INACTIVE'}` });
      fetchProducts();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update product active status.' });
    }
  };

  const handleDelete = async (productId, title) => {
    if (!window.confirm(`Are you sure you want to remove or deactivate '${title}'? If this product has previous order history, it will be safely deactivated.`)) {
      return;
    }

    try {
      setDeletingId(productId);
      await adminService.deleteProduct(productId);
      setFeedback({ type: 'success', message: `Product '${title}' removed / deactivated successfully.` });
      fetchProducts();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete product.' });
    } finally {
      setDeletingId(null);
    }
  };

  const columns = [
    {
      header: 'Produce Item',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src={row.imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&auto=format&fit=crop&q=60'}
            alt={row.title}
            style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-light)' }}
          />
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>{row.title}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {row.id.substring(0, 8)}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Category',
      render: (row) => (
        <span className="badge badge-category" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
          {row.categoryName || 'General'}
        </span>
      )
    },
    {
      header: 'Farm & Producer',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--primary-800)' }}>
            🌾 {row.farmName || 'Direct Farm'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Owner: {row.farmerName}
          </div>
        </div>
      )
    },
    {
      header: 'Price',
      render: (row) => (
        <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem' }}>
          ₹{row.pricePerUnit} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ {row.unit}</span>
        </div>
      )
    },
    {
      header: 'Inventory Stock',
      render: (row) => {
        const qty = row.stockQuantity || 0;
        const threshold = row.lowStockThreshold || 5;
        const isOutOfStock = qty <= 0;
        const isLow = qty > 0 && qty <= threshold;

        return (
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: isOutOfStock ? '#dc2626' : isLow ? '#d97706' : '#10b981' }}>
              {qty} {row.unit}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {isOutOfStock ? (
                <span style={{ color: '#dc2626', fontWeight: 600 }}>Out of Stock</span>
              ) : isLow ? (
                <span style={{ color: '#d97706', fontWeight: 600 }}>Low Stock (≤{threshold})</span>
              ) : (
                <span style={{ color: '#059669', fontWeight: 600 }}>In Stock</span>
              )}
            </div>
          </div>
        );
      }
    },
    {
      header: 'Active Listing',
      render: (row) => (
        <label className="admin-toggle-switch">
          <input
            type="checkbox"
            checked={!!row.isActive}
            onChange={() => handleToggleStatus(row)}
          />
          <span className="admin-toggle-slider" />
        </label>
      )
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <button
          onClick={() => handleDelete(row.id, row.title)}
          disabled={deletingId === row.id}
          className="btn btn-outline"
          style={{ padding: '0.35rem 0.6rem', color: '#dc2626', borderColor: '#fca5a5' }}
          title="Delete or Deactivate Produce"
        >
          <Trash2 size={14} />
        </button>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Produce Catalog & Inventory
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Monitor and moderate all produce listed across regional farms, manage visibility, and audit stock levels.
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
        data={products}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={setPage}
        searchQuery={search}
        onSearchChange={(val) => { setSearch(val); setPage(0); }}
        searchPlaceholder="Search produce title, farm name, owner..."
        filters={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }}
              className="form-input"
              style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.82rem', height: '40px' }}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              value={activeFilter}
              onChange={(e) => { setActiveFilter(e.target.value); setPage(0); }}
              className="form-input"
              style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.82rem', height: '40px' }}
            >
              <option value="">All Statuses</option>
              <option value="true">Active Only</option>
              <option value="false">Inactive Only</option>
            </select>
          </div>
        }
      />
    </div>
  );
};

export default AdminProductsPage;
