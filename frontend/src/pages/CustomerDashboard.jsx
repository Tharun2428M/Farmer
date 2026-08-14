import React from 'react';
import { ShoppingBag, ShoppingCart, Clock, Star, PackageSearch } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export const CustomerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <span className="badge badge-green"><ShoppingBag size={14} /> Customer Portal</span>
          <h1 className="heading-serif" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-900)', marginTop: '0.35rem' }}>
            Welcome, {user?.name || 'Customer'}!
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Browse fresh local produce, track your active orders, and write farmer reviews.</p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary-800)', marginBottom: '0.5rem' }}>
            <ShoppingCart size={22} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Active Cart</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>0 Items</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ready for checkout</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--earth-600)', marginBottom: '0.5rem' }}>
            <Clock size={22} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Recent Orders</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>0 Orders</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order tracking ready in Phase 2</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#d97706', marginBottom: '0.5rem' }}>
            <Star size={22} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Farmer Reviews</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>0 Reviews</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Submitted feedback</span>
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', backgroundColor: 'var(--primary-50)', border: '1px dashed var(--primary-500)' }}>
        <PackageSearch size={48} color="var(--primary-700)" style={{ margin: '0 auto 1rem auto' }} />
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
          Customer Dashboard Foundation (Phase 1)
        </h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
          The backend REST API architecture is prepared. Product browsing, direct cart addition, checkout, delivery tracking, and reviews will be connected to Supabase PostgreSQL in subsequent phases.
        </p>
      </div>
    </div>
  );
};

export default CustomerDashboard;
