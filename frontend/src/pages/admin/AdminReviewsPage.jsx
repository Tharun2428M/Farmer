import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/adminService';
import AdminDataTable from '../../components/admin/AdminDataTable';
import { Star, Trash2, AlertCircle, CheckCircle2, MessageSquare } from 'lucide-react';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminService.getReviews({
        rating: ratingFilter ? Number(ratingFilter) : undefined,
        query: search || undefined,
        page,
        size: 10
      });
      setReviews(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load reviews feed.' });
    } finally {
      setLoading(false);
    }
  }, [page, ratingFilter, search]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to remove this customer review? The farmer rating will be automatically recalculated.')) {
      return;
    }

    try {
      setDeletingId(reviewId);
      await adminService.deleteReview(reviewId);
      setFeedback({ type: 'success', message: 'Review deleted and farmer rating updated.' });
      fetchReviews();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete review.' });
    } finally {
      setDeletingId(null);
    }
  };

  const columns = [
    {
      header: 'Rating & Feedback',
      render: (row) => (
        <div style={{ maxWidth: '400px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '4px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                fill={star <= row.rating ? '#f59e0b' : 'none'}
                color={star <= row.rating ? '#f59e0b' : '#d1d5db'}
              />
            ))}
            <strong style={{ fontSize: '0.85rem', marginLeft: '6px', color: 'var(--text-main)' }}>
              {row.rating} / 5
            </strong>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.4, margin: 0 }}>
            "{row.comment || 'No text comment provided.'}"
          </p>
        </div>
      )
    },
    {
      header: 'Produce & Farm',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>
            {row.productTitle || 'Produce Item'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary-800)' }}>
            🌾 {row.farmerFarmName || 'Regional Farm'}
          </div>
        </div>
      )
    },
    {
      header: 'Reviewer',
      render: (row) => (
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
          {row.customerName || 'Verified Buyer'}
        </div>
      )
    },
    {
      header: 'Date',
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
          onClick={() => handleDelete(row.id)}
          disabled={deletingId === row.id}
          className="btn btn-outline"
          style={{ padding: '0.35rem 0.6rem', color: '#dc2626', borderColor: '#fca5a5' }}
          title="Remove Review"
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
            Customer Feedback & Review Moderation
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Inspect customer ratings across farm produce, remove spam or abusive feedback, and maintain quality scores.
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
        data={reviews}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={setPage}
        searchQuery={search}
        onSearchChange={(val) => { setSearch(val); setPage(0); }}
        searchPlaceholder="Search review comments, produce, farmers..."
        filters={
          <select
            value={ratingFilter}
            onChange={(e) => { setRatingFilter(e.target.value); setPage(0); }}
            className="form-input"
            style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.82rem', height: '40px' }}
          >
            <option value="">All Star Ratings</option>
            <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
            <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
            <option value="3">⭐⭐⭐ (3 Stars)</option>
            <option value="2">⭐⭐ (2 Stars)</option>
            <option value="1">⭐ (1 Star)</option>
          </select>
        }
      />
    </div>
  );
};

export default AdminReviewsPage;
