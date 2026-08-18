import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/adminService';
import AdminDateFilter from '../../components/admin/AdminDateFilter';
import AdminStatCard from '../../components/admin/AdminStatCard';
import { AdminLineChart, AdminBarChart, AdminDonutChart } from '../../components/admin/AdminCharts';
import {
  BarChart3,
  TrendingUp,
  IndianRupee,
  ShoppingBag,
  Users,
  Tractor,
  Layers,
  Star,
  Download,
  AlertCircle
} from 'lucide-react';

const AdminAnalyticsPage = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('7_DAYS');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAnalyticsOverview({
        range,
        startDate: range === 'CUSTOM' ? startDate : undefined,
        endDate: range === 'CUSTOM' ? endDate : undefined
      });
      setOverview(data);
    } catch (err) {
      setError(err.message || 'Failed to calculate analytics metrics.');
    } finally {
      setLoading(false);
    }
  }, [range, startDate, endDate]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div>
      {/* Header & Date Filter */}
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
            Analytics & Commercial Insights
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Comprehensive trade performance, customer acquisition, produce velocity, and revenue time-series.
          </p>
        </div>

        <AdminDateFilter
          selectedRange={range}
          onRangeChange={setRange}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
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
          <div style={{ marginTop: '1rem', fontWeight: 600 }}>Calculating Time-Series & Metrics...</div>
        </div>
      ) : (
        <>
          {/* Executive Analytics Metrics */}
          <div className="admin-grid-4">
            <AdminStatCard
              title="Platform Gross Volume"
              value={`₹${(overview?.totalRevenue || 0).toLocaleString('en-IN')}`}
              subtitle={`Avg Order: ₹${(overview?.averageOrderValue || 0).toFixed(2)}`}
              icon={IndianRupee}
              colorScheme="emerald"
            />
            <AdminStatCard
              title="Fulfilled Orders"
              value={(overview?.completedOrders || 0).toLocaleString('en-IN')}
              subtitle={`${overview?.pendingOrders || 0} currently processing`}
              icon={ShoppingBag}
              colorScheme="blue"
            />
            <AdminStatCard
              title="Active Consumers"
              value={(overview?.totalCustomers || 0).toLocaleString('en-IN')}
              subtitle={`+${overview?.newUsersThisMonth || 0} joined this month`}
              icon={Users}
              colorScheme="indigo"
            />
            <AdminStatCard
              title="Participating Farms"
              value={(overview?.totalFarmers || 0).toLocaleString('en-IN')}
              subtitle={`${overview?.activeProducts || 0} active listings`}
              icon={Tractor}
              colorScheme="amber"
            />
          </div>

          {/* Time Series Charts Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Revenue Trend */}
            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                    Revenue Over Time
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Daily gross marketplace sales (INR)</div>
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                  ₹{(overview?.totalRevenue || 0).toLocaleString('en-IN')}
                </div>
              </div>

              <AdminLineChart
                data={overview?.revenueOverTime || []}
                valueKey="value"
                labelKey="label"
                strokeColor="#2d6a4f"
                yAxisFormatter={(val) => `₹${val}`}
              />
            </div>

            {/* Orders Trend */}
            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                    Order Volume Over Time
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Daily direct customer orders placed</div>
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#3b82f6' }}>
                  {overview?.totalOrders || 0} Orders
                </div>
              </div>

              <AdminLineChart
                data={overview?.ordersOverTime || []}
                valueKey="value"
                labelKey="label"
                strokeColor="#3b82f6"
                yAxisFormatter={(val) => `${val}`}
              />
            </div>
          </div>

          {/* Distribution & Performance Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Category Breakdown */}
            <div className="admin-card">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} color="var(--primary-800)" />
                Category Distribution
              </h3>
              <AdminDonutChart
                data={overview?.categoryDistribution || []}
                valueKey="value"
                labelKey="label"
              />
            </div>

            {/* Order Status Breakdown */}
            <div className="admin-card">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingBag size={18} color="#f59e0b" />
                Fulfillment Status Mix
              </h3>
              <AdminDonutChart
                data={overview?.orderStatusDistribution || []}
                valueKey="value"
                labelKey="label"
              />
            </div>

            {/* Top Selling Products */}
            <div className="admin-card">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={18} color="#10b981" />
                Top-Selling Produce
              </h3>
              <AdminBarChart
                data={overview?.topSellingProducts || []}
                valueKey="value"
                labelKey="label"
                secondaryKey="secondaryValue"
                valueFormatter={(val) => `${val} units sold`}
              />
            </div>
          </div>

          {/* Top Farmers Leaderboard */}
          {overview?.topFarmers && overview.topFarmers.length > 0 && (
            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Tractor size={18} color="var(--primary-800)" />
                    Top Producer Farms by Sales
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Leading regional agricultural partners</div>
                </div>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Farm Name</th>
                      <th>Farmer Contact</th>
                      <th>Location</th>
                      <th>Fulfillment Count</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.topFarmers.map((f, i) => (
                      <tr key={f.id || i}>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                            🌾 {f.farmName}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.85rem' }}>{f.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{f.email}</div>
                        </td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {f.farmAddress || 'Location recorded'}
                        </td>
                        <td>
                          <strong style={{ color: 'var(--primary-800)' }}>{f.totalOrders || 0} orders</strong>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Star size={14} fill="#f59e0b" color="#f59e0b" />
                            <span style={{ fontWeight: 700 }}>{f.rating ? Number(f.rating).toFixed(1) : '5.0'}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminAnalyticsPage;
