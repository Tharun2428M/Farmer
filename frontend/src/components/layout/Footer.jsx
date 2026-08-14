import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Phone, Mail, MapPin, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--primary-900)',
      color: '#e2e8f0',
      paddingTop: '4.5rem',
      paddingBottom: '2.5rem',
      borderTop: '4px solid var(--primary-600)'
    }}>
      <div className="container">
        {/* Marketplace Value Highlights */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          paddingBottom: '3rem',
          marginBottom: '3rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'rgba(82, 183, 136, 0.15)', borderRadius: 'var(--radius-md)', color: 'var(--primary-500)' }}>
              <Sprout size={24} />
            </div>
            <div>
              <h4 style={{ color: 'white', fontSize: '0.9375rem', fontWeight: '700' }}>100% Farm Fresh</h4>
              <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Harvested daily by certified local farmers.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'rgba(82, 183, 136, 0.15)', borderRadius: 'var(--radius-md)', color: 'var(--primary-500)' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 style={{ color: 'white', fontSize: '0.9375rem', fontWeight: '700' }}>Zero Middlemen</h4>
              <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Direct farmer payouts and fair consumer pricing.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'rgba(82, 183, 136, 0.15)', borderRadius: 'var(--radius-md)', color: 'var(--primary-500)' }}>
              <Truck size={24} />
            </div>
            <div>
              <h4 style={{ color: 'white', fontSize: '0.9375rem', fontWeight: '700' }}>Direct Express Dispatch</h4>
              <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Delivered directly from farm to doorstep.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'rgba(82, 183, 136, 0.15)', borderRadius: 'var(--radius-md)', color: 'var(--primary-500)' }}>
              <RefreshCw size={24} />
            </div>
            <div>
              <h4 style={{ color: 'white', fontSize: '0.9375rem', fontWeight: '700' }}>Quality Guarantee</h4>
              <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>100% replacement or refund if dissatisfied.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          paddingBottom: '3rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* Brand Col */}
          <div style={{ maxWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <Sprout size={20} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white' }}>
                Farmers<span style={{ color: 'var(--primary-500)' }}>Market</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              Empowering regional farmers with a transparent, direct-selling marketplace. Bringing fresh, nutritious crops directly to urban households.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.9375rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <li><Link to="/" style={{ color: '#cbd5e1' }}>Home</Link></li>
              <li><Link to="/products" style={{ color: '#cbd5e1' }}>Browse Produce</Link></li>
              <li><Link to="/categories" style={{ color: '#cbd5e1' }}>All Categories</Link></li>
              <li><Link to="/about" style={{ color: '#cbd5e1' }}>About Our Mission</Link></li>
              <li><Link to="/contact" style={{ color: '#cbd5e1' }}>Contact & Helpdesk</Link></li>
            </ul>
          </div>

          {/* For Customers & Farmers */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.9375rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
              Marketplace Roles
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <li><Link to="/signup" style={{ color: '#cbd5e1' }}>Register as Customer</Link></li>
              <li><Link to="/signup" style={{ color: '#cbd5e1' }}>Sell Your Harvest (Farmer)</Link></li>
              <li><Link to="/login" style={{ color: '#cbd5e1' }}>Account Login</Link></li>
              <li><Link to="/about" style={{ color: '#cbd5e1' }}>Fair Pricing Promise</Link></li>
              <li><Link to="/contact" style={{ color: '#cbd5e1' }}>Quality Grievances</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.9375rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
              Agro Support Center
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <MapPin size={16} color="var(--primary-500)" />
                <span>Agricultural Hub, Maharashtra, India</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Phone size={16} color="var(--primary-500)" />
                <span>+91 (800) 547-2673</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Mail size={16} color="var(--primary-500)" />
                <span>support@farmersmarket.local</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '2rem',
          fontSize: '0.8125rem',
          color: '#94a3b8',
          gap: '1rem',
          textAlign: 'center'
        }}>
          <p>© 2026 Local Farmers Produce Direct-Selling Marketplace. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Cultivated with <Heart size={14} color="#ef4444" fill="#ef4444" /> for local agrarian communities.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
