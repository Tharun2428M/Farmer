import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Tractor,
  Package,
  Layers,
  ShoppingBag,
  CreditCard,
  Truck,
  Star,
  FileSpreadsheet,
  AlertTriangle,
  Activity,
  Menu,
  X,
  LogOut,
  Store,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navSections = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
        { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
        { name: 'Reports & CSV', path: '/admin/reports', icon: FileSpreadsheet },
      ]
    },
    {
      title: 'Management',
      items: [
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Farmers', path: '/admin/farmers', icon: Tractor },
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Low Stock Alerts', path: '/admin/low-stock', icon: AlertTriangle },
        { name: 'Categories', path: '/admin/categories', icon: Layers },
      ]
    },
    {
      title: 'Operations',
      items: [
        { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
        { name: 'Payments', path: '/admin/payments', icon: CreditCard },
        { name: 'Deliveries', path: '/admin/deliveries', icon: Truck },
        { name: 'Reviews Moderation', path: '/admin/reviews', icon: Star },
        { name: 'System Diagnostics', path: '/admin/system', icon: Activity },
      ]
    }
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar Overlay on mobile */}
      {sidebarOpen && (
        <div
          className="admin-modal-overlay"
          style={{ zIndex: 45 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <NavLink to="/admin" className="admin-sidebar-brand" onClick={() => setSidebarOpen(false)}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #52b788 0%, #2d6a4f 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}>
              <ShieldCheck size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                FARM<span style={{ color: '#52b788' }}>ADMIN</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                Operations HQ
              </div>
            </div>
          </NavLink>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'none' }}
            className="mobile-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-sidebar-nav">
          {navSections.map((section, idx) => (
            <div key={idx} style={{ marginBottom: '0.75rem' }}>
              <div className="admin-nav-section-title">{section.title}</div>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#52b788',
              color: '#12281e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {user?.name || 'Administrator'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#74c69d' }}>Super Admin</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main-wrapper">
        {/* Top Navbar */}
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: '#f3f4f6',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '6px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--text-main)'
              }}
            >
              <Menu size={18} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>Admin HQ</span>
              <ChevronRight size={14} />
              <span style={{ color: 'var(--text-main)', fontWeight: 600, textTransform: 'capitalize' }}>
                {location.pathname.replace('/admin', '').replace('/', '') || 'Dashboard'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <NavLink
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                color: 'var(--primary-800)',
                textDecoration: 'none',
                fontWeight: 600,
                background: 'var(--primary-50)',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--primary-100)'
              }}
            >
              <Store size={15} />
              <span>Live Marketplace</span>
            </NavLink>

            <span className="admin-badge admin-badge-active" style={{ fontSize: '0.75rem' }}>
              <ShieldCheck size={12} />
              Admin Mode
            </span>
          </div>
        </header>

        {/* Dynamic Page Outlet */}
        <main className="admin-content-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
