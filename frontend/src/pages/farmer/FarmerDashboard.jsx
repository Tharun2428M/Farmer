import React, { useState } from 'react';
import { Tractor, ShieldCheck, CheckCircle2, AlertCircle, ShoppingBag, PlusCircle, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import authService from '../../services/authService';

export const FarmerDashboard = () => {
  const { user, role } = useAuth();
  const [apiTestResult, setApiTestResult] = useState(null);
  const [testingApi, setTestingApi] = useState(false);
  const [testError, setTestError] = useState('');

  const handleTestProtectedApi = async () => {
    setTestingApi(true);
    setApiTestResult(null);
    setTestError('');
    try {
      const res = await authService.testFarmerAccess();
      setApiTestResult(res);
    } catch (err) {
      setTestError(err.message || 'Failed to call farmer protected API');
    } finally {
      setTestingApi(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-app)', minHeight: '80vh', padding: '3.5rem 0' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        
        {/* Welcome Header Card */}
        <div className="card" style={{
          padding: '2.5rem',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '2rem',
          borderLeft: '6px solid var(--accent-orange)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#fff3e0',
              color: '#e65100',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Tractor size={28} />
            </div>
            <div>
              <span className="badge badge-category" style={{ backgroundColor: '#fff3e0', color: '#b45309' }}>
                Verified Farmer Portal
              </span>
              <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--primary-900)', marginTop: '0.2rem' }}>
                Welcome, Farmer {user?.name || 'Grower'}!
              </h1>
            </div>
          </div>

          <p style={{ fontSize: '0.9375rem', color: 'var(--text-body)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            You are securely authenticated via <strong>Spring Security & JWT</strong> with the <code>FARMER</code> role. In upcoming phases, you will be able to list your daily harvests, manage crop inventories, and monitor direct buyer payouts.
          </p>

          {/* Farmer Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            padding: '1.25rem',
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Grower Email</span>
              <p style={{ fontSize: '0.9375rem', fontWeight: '700', color: 'var(--primary-900)' }}>{user?.email || 'N/A'}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Assigned Role</span>
              <p style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#e65100' }}>{role}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Status</span>
              <p style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#15803d' }}>{user?.status || 'ACTIVE'}</p>
            </div>
          </div>
        </div>

        {/* Spring Security RBAC Verification Panel */}
        <div className="card" style={{
          padding: '2.5rem',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-900)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={22} color="var(--primary-700)" />
            Farmer RBAC Protected Endpoint Test
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Click below to execute an authenticated <code>GET /api/farmer/test</code> request using your Bearer JWT token.
          </p>

          <Button
            variant="outline"
            size="md"
            loading={testingApi}
            onClick={handleTestProtectedApi}
          >
            {testingApi ? 'Verifying with Spring Boot...' : 'Verify Farmer Protected Endpoint'}
          </Button>

          {apiTestResult && (
            <div style={{
              marginTop: '1.25rem',
              padding: '1rem',
              backgroundColor: 'var(--primary-50)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--primary-300)',
              fontSize: '0.875rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary-900)', fontWeight: '700' }}>
                <CheckCircle2 size={18} color="var(--primary-700)" />
                <span>Backend Authorized: {apiTestResult.message}</span>
              </div>
              <pre style={{ backgroundColor: 'white', padding: '0.75rem', borderRadius: 'var(--radius-sm)', overflowX: 'auto', fontSize: '0.8125rem' }}>
                {JSON.stringify(apiTestResult, null, 2)}
              </pre>
            </div>
          )}

          {testError && (
            <div style={{
              marginTop: '1.25rem',
              padding: '1rem',
              backgroundColor: '#fee2e2',
              borderRadius: 'var(--radius-md)',
              color: '#991b1b',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={18} color="#dc2626" />
              <span>{testError}</span>
            </div>
          )}
        </div>

        {/* Action Link */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/products">
            <Button variant="primary" size="lg" icon={<Leaf size={18} />}>
              View Live Marketplace Listings
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default FarmerDashboard;
