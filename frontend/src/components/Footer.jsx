import React from 'react';
import { Sprout, Heart, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--primary-900)',
      color: '#e2e8f0',
      paddingTop: '4rem',
      paddingBottom: '2rem',
      marginTop: 'auto',
      borderTop: '4px solid var(--primary-600)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Col 1: Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Sprout size={22} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                FarmDirect
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Empowering local farmers and bringing fresh, sustainable, non-GMO produce straight from farm fields to your kitchen table.
            </p>
          </div>

          {/* Col 2: Marketplace Roles */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.2rem' }}>
              Marketplace Roles
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li>🌾 <strong>Farmers:</strong> List produce, manage inventory & pricing</li>
              <li>🛒 <strong>Customers:</strong> Browse fresh local harvests & track orders</li>
              <li>⚙️ <strong>Admins:</strong> Oversee quality, users & platform compliance</li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.2rem' }}>
              Platform Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li><a href="/" style={{ color: '#cbd5e1' }}>Marketplace Home</a></li>
              <li><a href="#how-it-works" style={{ color: '#cbd5e1' }}>Direct Supply Workflow</a></li>
              <li><a href="#benefits" style={{ color: '#cbd5e1' }}>Local Community Benefits</a></li>
              <li><span style={{ color: '#64748b' }}>Phase 1 Foundation Architecture</span></li>
            </ul>
          </div>

          {/* Col 4: Contact & Support */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.2rem' }}>
              Capstone Contact
            </h4>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--primary-500)" /> Local Agricultural Hub
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="var(--primary-500)" /> support@farmersmarket.local
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--primary-500)" /> +1 (800) FARM-DIRECT
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.85rem',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} Local Farmers Produce Direct-Selling Marketplace. Capstone Architecture Phase 1.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built with <Heart size={14} color="#ef4444" fill="#ef4444" /> for Local Farming Communities
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
