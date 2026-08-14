import React from 'react';
import { Shield, Users, Tractor, AlertTriangle, Activity } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export const AdminDashboard = () => {
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
          <span className="badge" style={{ backgroundColor: '#e0e7ff', color: '#3730a3' }}>
            <Shield size={14} /> Admin System Portal
          </span>
          <h1 className="heading-serif" style={{ fontSize: '2rem', fontWeight: 700, color: '#1e1b4b', marginTop: '0.35rem' }}>
            Platform Administration
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>System health monitoring, user role management, farmer verification, and compliance.</p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#3730a3', marginBottom: '0.5rem' }}>
            <Users size={22} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Registered Users</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>1 Admin (You)</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Role-based user database</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--earth-600)', marginBottom: '0.5rem' }}>
            <Tractor size={22} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Farmer Verification</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>0 Pending</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Agricultural credential audit</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary-800)', marginBottom: '0.5rem' }}>
            <Activity size={22} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Spring Boot REST API</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-700)' }}>UP (200 OK)</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Endpoint: /api/health</span>
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', backgroundColor: '#f5f3ff', border: '1px dashed #6366f1' }}>
        <Shield size={48} color="#4f46e5" style={{ margin: '0 auto 1rem auto' }} />
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#312e81', marginBottom: '0.5rem' }}>
          Admin Management Console (Phase 1)
        </h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 1.5rem auto' }}>
          Platform security architecture is established with Spring Security. Role verification for CUSTOMER, FARMER, and ADMIN endpoints will be connected in Phase 2.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
