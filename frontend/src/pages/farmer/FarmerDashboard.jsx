import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  Boxes, 
  TrendingUp, 
  Edit, 
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Sprout,
  Store,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import farmerService from '../../services/farmerService';
import authService from '../../services/authService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalInventoryQuantity: 0
  });
  const [profile, setProfile] = useState(null);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // RBAC test state
  const [rbacLoading, setRbacLoading] = useState(false);
  const [rbacResult, setRbacResult] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsData, profileData, productsData] = await Promise.all([
        farmerService.getStats(),
        farmerService.getProfile(),
        farmerService.getProducts()
      ]);
      setStats(statsData);
      setProfile(profileData);
      setRecentProducts(productsData.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err.response?.data?.message || 'Could not load your farm dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleTestRbac = async () => {
    setRbacLoading(true);
    setRbacResult(null);
    try {
      const res = await authService.testFarmerAccess();
      setRbacResult({
        success: true,
        data: res.data,
        message: 'RBAC Verification Passed: You are authorized with ROLE_FARMER.'
      });
    } catch (err) {
      setRbacResult({
        success: false,
        message: err.response?.data?.message || 'RBAC Access Denied: Invalid role or expired token.'
      });
    } finally {
      setRbacLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center">
        <LoadingSpinner text="Harvesting farm dashboard data..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                <Sprout className="w-3.5 h-3.5" />
                Farmer Workspace
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome, {profile?.farmerName || user?.name || 'Local Grower'}!
              </h1>
              <p className="text-emerald-100/80 text-sm sm:text-base flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-400" />
                {profile?.farmName || 'Your Farm Outlet'} &bull; {profile?.farmAddress || 'Location configured'}
              </p>
            </div>

            {/* Top Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={fetchDashboardData}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl backdrop-blur-sm transition-all"
                title="Refresh Metrics"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <Link
                to="/farmer/profile"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl backdrop-blur-sm transition-all"
              >
                <Store className="w-4 h-4 text-emerald-300" />
                Farm Profile
              </Link>
              <Link
                to="/farmer/products/add"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                Add New Produce
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Products */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Listings</span>
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{stats.totalProducts}</span>
              <span className="text-xs text-slate-500 font-medium">produce items</span>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs">
              <span className="text-slate-500">Active online: <strong className="text-slate-800">{stats.activeProducts}</strong></span>
              <Link to="/farmer/products" className="text-emerald-700 font-bold hover:underline">Manage &rarr;</Link>
            </div>
          </div>

          {/* Active Listings */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Harvests</span>
              <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-teal-700">{stats.activeProducts}</span>
              <span className="text-xs text-slate-500 font-medium">available to buyers</span>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>Customer visible items</span>
              <span className="text-teal-700 font-semibold">{stats.totalProducts ? Math.round((stats.activeProducts / stats.totalProducts) * 100) : 0}% Active</span>
            </div>
          </div>

          {/* Low / Out of Stock */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stock Alerts</span>
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-600">{stats.lowStockProducts + stats.outOfStockProducts}</span>
              <span className="text-xs text-slate-500 font-medium">items need restock</span>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>{stats.outOfStockProducts} zero stock</span>
              <span className="text-amber-600 font-semibold">{stats.lowStockProducts} low stock</span>
            </div>
          </div>

          {/* Total Units in Stock */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Inventory</span>
              <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
                <Boxes className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{stats.totalInventoryQuantity}</span>
              <span className="text-xs text-slate-500 font-medium">units across crops</span>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>Ready for delivery</span>
              <span className="text-blue-700 font-semibold">Live Stock</span>
            </div>
          </div>
        </div>

        {/* Recent Produce Listings Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-700" />
                Recent Harvest Listings
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage your crops, update stock quantities, or modify prices</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/farmer/products"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl transition-colors"
              >
                View Full Catalog ({stats.totalProducts}) &rarr;
              </Link>
            </div>
          </div>

          {recentProducts.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sprout className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No agricultural produce listed yet</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
                Start listing your fresh farm harvests such as organic tomatoes, fresh spinach, leafy greens, and farm fruits to sell directly to customers.
              </p>
              <Link
                to="/farmer/products/add"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-md transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                Add Your First Produce
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-6">Product</th>
                    <th className="py-3 px-6">Category</th>
                    <th className="py-3 px-6">Price</th>
                    <th className="py-3 px-6">Stock Level</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {recentProducts.map((p) => {
                    const isOutOfStock = (p.stockQuantity || 0) === 0;
                    const isLowStock = !isOutOfStock && (p.stockQuantity || 0) <= (p.lowStockThreshold || 5);

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=60'}
                              alt={p.title}
                              className="w-11 h-11 rounded-xl object-cover border border-slate-100 bg-slate-50 flex-shrink-0"
                            />
                            <div>
                              <p className="font-semibold text-slate-900">{p.title}</p>
                              <p className="text-xs text-slate-400">Unit: {p.unit}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                            {p.categoryName || 'General'}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-900">
                          ₹{p.pricePerUnit} <span className="text-xs font-normal text-slate-400">/ {p.unit}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${isOutOfStock ? 'text-rose-600' : isLowStock ? 'text-amber-600' : 'text-slate-800'}`}>
                              {p.stockQuantity} {p.unit}
                            </span>
                            {isOutOfStock ? (
                              <Badge variant="error" text="Out of Stock" />
                            ) : isLowStock ? (
                              <Badge variant="warning" text="Low Stock" />
                            ) : (
                              <Badge variant="success" text="In Stock" />
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {p.isActive ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <Link
                            to={`/farmer/products/edit/${p.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Security & RBAC Test Box */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base font-bold text-slate-800">Security & Role-Based Access Control (RBAC)</h2>
            </div>
            <button
              onClick={handleTestRbac}
              disabled={rbacLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              {rbacLoading ? 'Verifying with Spring Security...' : 'Test Farmer API Security Token'}
            </button>
          </div>

          {rbacResult && (
            <div className={`p-4 rounded-xl text-xs font-mono border ${rbacResult.success ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
              <p className="font-bold mb-1">{rbacResult.message}</p>
              {rbacResult.data && (
                <pre className="text-[11px] overflow-x-auto p-2 bg-white/60 rounded">
                  {JSON.stringify(rbacResult.data, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
