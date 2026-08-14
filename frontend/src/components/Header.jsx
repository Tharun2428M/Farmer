import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, LogIn, UserPlus, LogOut, Menu, X, Shield, Tractor, ShoppingBag } from 'lucide-react';
import Navigation from './Navigation';
import useAuth from '../hooks/useAuth';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleBadge = () => {
    if (role === 'FARMER') {
      return (
        <span className="badge badge-earth">
          <Tractor size={14} /> Farmer
        </span>
      );
    }
    if (role === 'ADMIN') {
      return (
        <span className="badge" style={{ backgroundColor: '#e0e7ff', color: '#3730a3' }}>
          <Shield size={14} /> Admin
        </span>
      );
    }
    return (
      <span className="badge badge-green">
        <ShoppingBag size={14} /> Customer
      </span>
    );
  };

  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid var(--border-light)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-800)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Sprout size={24} />
          </div>
          <div>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--primary-900)',
              letterSpacing: '-0.02em',
              display: 'block',
              lineHeight: '1.1'
            }}>
              FarmDirect
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--earth-600)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Local Marketplace
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div style={{ display: 'none', md: 'flex', alignItems: 'center' }} className="desktop-nav">
          <Navigation />
        </div>

        {/* Action Buttons & Auth Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {getRoleBadge()}
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-outline"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                <LogIn size={16} /> Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                <UserPlus size={16} /> Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-900)'
            }}
            className="mobile-toggle"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          padding: '1rem 1.5rem 1.5rem 1.5rem',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-light)'
        }}>
          <Navigation mobile={true} onItemClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </header>
  );
};

export default Header;
