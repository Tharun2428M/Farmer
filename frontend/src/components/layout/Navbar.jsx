import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sprout, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  LogIn,
  UserPlus,
  LogOut,
  LayoutDashboard,
  Tractor,
  Shield
} from 'lucide-react';
import Button from '../common/Button';
import useAuth from '../../hooks/useAuth';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/', { replace: true });
  };

  const getDashboardPath = () => {
    if (role === 'CUSTOMER') return '/customer/dashboard';
    if (role === 'FARMER') return '/farmer/dashboard';
    if (role === 'ADMIN') return '/admin/dashboard';
    return '/';
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Produce Catalog' },
    { path: '/categories', label: 'Categories' },
    { path: '/about', label: 'Our Mission' },
    { path: '/contact', label: 'Contact & Support' }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'var(--bg-surface-glass)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border-light)',
      boxShadow: 'var(--shadow-xs)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '4.5rem'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-800)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 2px 8px rgba(45, 106, 79, 0.3)'
          }}>
            <Sprout size={24} />
          </div>
          <div>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: '800',
              color: 'var(--primary-900)',
              letterSpacing: '-0.02em',
              display: 'block',
              lineHeight: '1.1'
            }}>
              Farmers<span style={{ color: 'var(--primary-600)' }}>Market</span>
            </span>
            <span style={{
              fontSize: '0.6875rem',
              color: 'var(--earth-600)',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              Direct From Soil to Home
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', gap: '1.75rem', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              style={({ isActive }) => ({
                fontSize: '0.9375rem',
                fontWeight: isActive ? '700' : '600',
                color: isActive ? 'var(--primary-800)' : 'var(--text-body)',
                position: 'relative',
                padding: '0.35rem 0',
                transition: 'color var(--transition-fast)'
              })}
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <span style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '2.5px',
                      backgroundColor: 'var(--primary-600)',
                      borderRadius: 'var(--radius-full)'
                    }} />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          
          {/* Wishlist & Cart icons (Visible for Customers or Browsers) */}
          {(!role || role === 'CUSTOMER') && (
            <>
              <Link
                to="/products"
                title="Wishlist"
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--text-body)',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-light)'
                }}
              >
                <Heart size={18} />
              </Link>

              <Link
                to="/products"
                title="Shopping Cart"
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--text-body)',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-light)'
                }}
              >
                <ShoppingBag size={18} />
              </Link>
            </>
          )}

          {/* Desktop Auth State: Logged In vs Logged Out */}
          <div style={{ display: 'none', alignItems: 'center', gap: '0.65rem' }} className="desktop-auth-btns">
            {isAuthenticated && user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* User info badge */}
                <Link
                  to={getDashboardPath()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.35rem 0.75rem',
                    backgroundColor: 'var(--primary-50)',
                    border: '1px solid var(--primary-300)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8125rem'
                  }}
                >
                  {role === 'FARMER' ? (
                    <Tractor size={15} color="#e65100" />
                  ) : role === 'ADMIN' ? (
                    <Shield size={15} color="#0284c7" />
                  ) : (
                    <User size={15} color="var(--primary-800)" />
                  )}
                  <strong style={{ color: 'var(--primary-900)' }}>{user.name || user.email}</strong>
                  <span style={{
                    fontSize: '0.6875rem',
                    fontWeight: '800',
                    backgroundColor: role === 'ADMIN' ? '#e0f2fe' : role === 'FARMER' ? '#fff3e0' : 'var(--primary-100)',
                    color: role === 'ADMIN' ? '#0369a1' : role === 'FARMER' ? '#b45309' : 'var(--primary-800)',
                    padding: '0.1rem 0.45rem',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    {role}
                  </span>
                </Link>

                {/* Dashboard Link */}
                <Link to={getDashboardPath()}>
                  <Button variant="secondary" size="sm" icon={<LayoutDashboard size={15} />}>
                    Dashboard
                  </Button>
                </Link>

                {/* Logout Button */}
                <Button variant="ghost" size="sm" onClick={handleLogout} icon={<LogOut size={15} />} title="Sign Out">
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" icon={<LogIn size={16} />}>
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm" icon={<UserPlus size={16} />}>
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--primary-900)',
              display: 'flex',
              padding: '0.35rem'
            }}
            className="mobile-hamburger-btn"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-light)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }} className="mobile-drawer">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '0.65rem 0.5rem',
                fontWeight: '600',
                color: location.pathname === link.path ? 'var(--primary-800)' : 'var(--text-main)',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated && user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div style={{ padding: '0.5rem', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
                Signed in as: <strong>{user.name}</strong> ({role})
              </div>
              <Link to={getDashboardPath()} style={{ width: '100%' }} onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" fullWidth size="sm" icon={<LayoutDashboard size={16} />}>
                  Go to {role} Dashboard
                </Button>
              </Link>
              <Button variant="outline" fullWidth size="sm" onClick={handleLogout} icon={<LogOut size={16} />}>
                Logout
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Link to="/login" style={{ flex: 1 }} onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" fullWidth size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup" style={{ flex: 1 }} onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" fullWidth size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 960px) {
          .desktop-nav { display: flex !important; }
          .desktop-auth-btns { display: flex !important; }
          .mobile-hamburger-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
