import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import {
  Activity,
  Database,
  Cpu,
  Clock,
  Server,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap
} from 'lucide-react';

const AdminSystemHealthPage = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const data = await adminService.getSystemHealth();
      setHealth(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve system health diagnostics.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const memPct = health
    ? Math.round((health.jvmUsedMemoryMb / health.jvmTotalMemoryMb) * 100)
    : 0;

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            System Health & Infrastructure Diagnostics
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Live status of Spring Boot application runtime, Supabase PostgreSQL database latency, and memory allocation.
          </p>
        </div>

        <button
          onClick={fetchHealth}
          disabled={refreshing}
          className="btn btn-outline"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <RefreshCw size={15} className={refreshing ? 'spin' : ''} />
          <span>{refreshing ? 'Testing Connectivity...' : 'Ping Diagnostics'}</span>
        </button>
      </div>

      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#991b1b',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--primary-800)' }}>
          <div className="spin" style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid #b7e4c7', borderTopColor: '#2d6a4f', borderRadius: '50%' }} />
          <div style={{ marginTop: '1rem', fontWeight: 600 }}>Pinging Database & Runtime Metrics...</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Main Status Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Overall Health Card */}
            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: '#ecfdf5',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Activity size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Core System State
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {health?.status === 'UP' ? 'All Systems Operational' : 'Degraded Performance'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <span className="admin-badge admin-badge-active">
                  <CheckCircle2 size={12} />
                  API {health?.apiStatus || 'HEALTHY'}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>Build: v{health?.appVersion}</span>
              </div>
            </div>

            {/* Database Connectivity Card */}
            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: '#eff6ff',
                  color: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Database size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Database Latency
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#3b82f6' }}>
                    {health?.databaseLatencyMs >= 0 ? `${health.databaseLatencyMs} ms` : 'Offline'}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Status: <strong style={{ color: '#10b981' }}>{health?.databaseStatus}</strong>
              </div>
            </div>

            {/* Uptime Card */}
            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: '#fffbeb',
                  color: '#f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Clock size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Application Uptime
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {health ? `${Math.floor(health.systemUptimeSeconds / 3600)}h ${Math.floor((health.systemUptimeSeconds % 3600) / 60)}m ${health.systemUptimeSeconds % 60}s` : 'N/A'}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Engine: <strong style={{ color: 'var(--text-main)' }}>Spring Boot 3.3.2</strong>
              </div>
            </div>
          </div>

          {/* Detailed JVM Memory Section */}
          <div className="admin-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={18} color="var(--primary-800)" />
              JVM Memory Utilization & Allocation
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Allocated Heap Utilization</span>
                <strong>{health?.jvmUsedMemoryMb} MB of {health?.jvmTotalMemoryMb} MB ({memPct}%)</strong>
              </div>

              <div style={{ height: '12px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${memPct}%`,
                    backgroundColor: memPct > 85 ? '#ef4444' : memPct > 65 ? '#f59e0b' : '#10b981',
                    borderRadius: '999px',
                    transition: 'width 0.5s ease'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
              <div style={{ backgroundColor: '#f8faf9', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Used Heap</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  {health?.jvmUsedMemoryMb} MB
                </div>
              </div>

              <div style={{ backgroundColor: '#f8faf9', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Free Heap</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981', marginTop: '0.2rem' }}>
                  {health?.jvmFreeMemoryMb} MB
                </div>
              </div>

              <div style={{ backgroundColor: '#f8faf9', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Heap Allocated</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-800)', marginTop: '0.2rem' }}>
                  {health?.jvmTotalMemoryMb} MB
                </div>
              </div>
            </div>
          </div>

          {/* Environment & Security Details */}
          <div className="admin-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="#10b981" />
              Runtime Environment & Security Profile
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Target Environment</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{health?.environment}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Security Protocol</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>JWT HMAC-SHA256 (Stateless Session)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Connection Pool</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>HikariCP (Max 10 Pool Connections)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSystemHealthPage;
