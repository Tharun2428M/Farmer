import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import AdminStatCard from '../../components/admin/AdminStatCard';
import {
  Users,
  Tractor,
  Package,
  ShoppingBag,
  IndianRupee,
  AlertTriangle,
  Activity,
  ArrowRight,
  Clock,
  CheckCircle2,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, healthData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getSystemHealth()
      ]);
      setStats(statsData);
      setHealth(healthData);
    } catch (err) {
      setError(err.message || 'Failed to load executive dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--primary-800)' }}>
        <div className="spin" style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid #b7e4c7', borderTopColor: '#2d6a4f', borderRadius: '50%' }} />
        <div style={{ marginTop: '1rem', fontWeight: 600 }}>Aggregating Platform Intelligence...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-card" style={{ borderColor: '#fca5a5', backgroundColor: '#fef2f2', padding: '2rem', textAlign: 'center' }}>
        <AlertTriangle size={36} color="#dc2626" style={{ margin: '0 auto 0.75rem' }} />
        <h3 style={{ color: '#991b1b', marginBottom: '0.5rem' }}>Failed to Load Dashboard</h3>
        <p style={{ color: '#7f1d1d', fontSize: '0.9rem', marginBottom: '1.25rem' }}>{error}</p>
        <button className="btn btn-primary" onClick={fetchDashboardData}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        color: '#ffffff',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <ShieldCheck size={20} color="#74c69d" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#74c69d' }}>
              System Command Center
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
            Executive Dashboard
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', marginTop: '0.35rem', maxWidth: '600px' }}>
            Real-time direct-trade metrics, farmer activity, marketplace revenue, and fulfillment operations.
          </p>
        </div>

        {health && (
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1.25rem',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem'
          }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', fontWeight: 600 }}>
                DB Ping Latency
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#74c69d' }}>
                {health.databaseLatencyMs >= 0 ? `${health.databaseLatencyMs} ms` : 'N/A'}
              </div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '1.25rem' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', fontWeight: 600 }}>
                JVM Memory
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                {health.jvmUsedMemoryMb} / {health.jvmTotalMemoryMb} MB
              </div>
            </div>
          </div>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="admin-grid-4">
        <AdminStatCard
          title="Total Gross Revenue"
          value={`₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`}
          subtitle={`₹${(stats?.todayRevenue || 0).toLocaleString('en-IN')} today`}
          icon={IndianRupee}
          colorScheme="emerald"
          onClick={() => navigate('/admin/analytics')}
        />
        <AdminStatCard
          title="Total Orders"
          value={(stats?.totalOrders || 0).toLocaleString('en-IN')}
          subtitle={`${stats?.pendingOrders || 0} awaiting fulfillment`}
          icon={ShoppingBag}
          colorScheme="blue"
          onClick={() => navigate('/admin/orders')}
        />
        <AdminStatCard
          title="Registered Farmers"
          value={(stats?.totalFarmers || 0).toLocaleString('en-IN')}
          subtitle={`${stats?.totalCustomers || 0} active consumers`}
          icon={Tractor}
          colorScheme="amber"
          onClick={() => navigate('/admin/farmers')}
        />
        <AdminStatCard
          title="Active Produce"
          value={(stats?.activeProducts || 0).toLocaleString('en-IN')}
          subtitle={`${stats?.lowStockProducts || 0} low stock items`}
          icon={Package}
          colorScheme={stats?.lowStockProducts > 0 ? 'rose' : 'emerald'}
          onClick={() => navigate('/admin/products')}
        />
      </div>

      {/* Operational Highlights & Fast Navigation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Quick Operations */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} color="var(--primary-800)" />
            Fast Operations
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div
              onClick={() => navigate('/admin/orders?status=PENDING')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#f8faf9',
                border: '1px solid var(--border-light)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Clock size={18} color="#d97706" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>Review Pending Orders</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stats?.pendingOrders || 0} orders waiting confirmation</div>
                </div>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
            </div>

            <div
              onClick={() => navigate('/admin/low-stock')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: stats?.lowStockProducts > 0 ? '#fff1f2' : '#f8faf9',
                border: `1px solid ${stats?.lowStockProducts > 0 ? '#fecdd3' : 'var(--border-light)'}`,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <AlertTriangle size={18} color={stats?.lowStockProducts > 0 ? '#e11d48' : '#6b7280'} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>Low Stock Produce</div>
                  <div style={{ fontSize: '0.75rem', color: stats?.lowStockProducts > 0 ? '#be123c' : 'var(--text-muted)' }}>
                    {stats?.lowStockProducts || 0} items at threshold
                  </div>
                </div>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
            </div>

            <div
              onClick={() => navigate('/admin/reports')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#f8faf9',
                border: '1px solid var(--border-light)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Activity size={18} color="var(--primary-800)" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>Download Reports & CSV</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Export sales, produce, farmers & customers</div>
                </div>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
            </div>
          </div>
        </div>

        {/* Platform Health Summary */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="#10b981" />
            Infrastructure Status
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Database Provider</span>
              <strong style={{ color: 'var(--text-main)' }}>Supabase PostgreSQL</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Database Health</span>
              <span className="admin-badge admin-badge-active">{health?.databaseStatus || 'CONNECTED'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>API Version</span>
              <strong style={{ color: 'var(--text-main)' }}>v{health?.appVersion || '1.0.0'} (Release)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>System Uptime</span>
              <strong style={{ color: 'var(--text-main)' }}>
                {health ? `${Math.floor(health.systemUptimeSeconds / 3600)}h ${Math.floor((health.systemUptimeSeconds % 3600) / 60)}m` : 'Active'}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
