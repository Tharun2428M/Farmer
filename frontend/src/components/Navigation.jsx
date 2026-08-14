import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export const Navigation = ({ mobile = false, onItemClick }) => {
  const { user, role } = useAuth();

  const getDashboardPath = () => {
    if (role === 'FARMER') return '/dashboard/farmer';
    if (role === 'ADMIN') return '/dashboard/admin';
    return '/dashboard/customer';
  };

  const linkStyle = ({ isActive }) => ({
    padding: mobile ? '0.75rem 1rem' : '0.5rem 0.85rem',
    borderRadius: 'var(--radius-sm)',
    fontWeight: isActive ? '700' : '500',
    color: isActive ? 'var(--primary-800)' : 'var(--text-main)',
    backgroundColor: isActive && mobile ? 'var(--primary-100)' : 'transparent',
    transition: 'all var(--transition-fast)'
  });

  return (
    <nav style={{
      display: 'flex',
      flexDirection: mobile ? 'column' : 'row',
      gap: mobile ? '0.5rem' : '1rem',
      alignItems: mobile ? 'stretch' : 'center'
    }}>
      <NavLink to="/" style={linkStyle} onClick={onItemClick}>Home</NavLink>
      
      {user && (
        <NavLink to={getDashboardPath()} style={linkStyle} onClick={onItemClick}>
          {role === 'FARMER' ? 'Farmer Portal' : role === 'ADMIN' ? 'Admin Portal' : 'My Dashboard'}
        </NavLink>
      )}

      <a href="#how-it-works" style={{ ...linkStyle({ isActive: false }), cursor: 'pointer' }} onClick={onItemClick}>
        How It Works
      </a>
      <a href="#benefits" style={{ ...linkStyle({ isActive: false }), cursor: 'pointer' }} onClick={onItemClick}>
        Benefits
      </a>
    </nav>
  );
};

export default Navigation;
