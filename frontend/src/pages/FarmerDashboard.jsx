import React from 'react';
import { Tractor, PlusCircle, PackageCheck, DollarSign, Sprout } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export const FarmerDashboard = () => {
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
          <span className="badge badge-earth"><Tractor size={14} /> Farmer Portal</span>
          <h1 className="heading-serif" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--earth-800)', marginTop: '0.35rem' }}>
            {user?.farmName ? `${user.farmName} Dashboard` : `Welcome, Farmer ${user?.name || ''}`}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your agricultural listings, update produce stock & prices, and fulfill customer orders.</p>
        </div>
        <button className="btn btn-primary" style={{ backgroundColor: 'var(--earth-800)', borderColor: 'var(--earth-800)' }}>
          <PlusCircle size={18} /> Add New Crop Listing
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary-800)', marginBottom: '0.5rem' }}>
            <Sprout size={22} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Active Listings</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>0 Products</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Listed produce items</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--earth-600)', marginBottom: '0.5rem' }}>
            <PackageCheck size={22} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Pending Orders</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>0 Orders</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Waiting for fulfillment</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary-700)', marginBottom: '0.5rem' }}>
            <DollarSign size={22} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Total Direct Revenue</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>$0.00</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Earnings history</span>
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', backgroundColor: 'var(--earth-100)', border: '1px dashed var(--earth-500)' }}>
        <Tractor size={48} color="var(--earth-800)" style={{ margin: '0 auto 1rem auto' }} />
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--earth-800)', marginBottom: '0.5rem' }}>
          Farmer Inventory Portal (Phase 1)
        </h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 1.5rem auto' }}>
          The Spring Boot REST API controller and database entities for product listing management, price updates, and order status tracking are ready for business logic connection.
        </p>
      </div>
    </div>
  );
};

export default FarmerDashboard;
