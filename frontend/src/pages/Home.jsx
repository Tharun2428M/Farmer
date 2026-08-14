import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  ShoppingBag, 
  Tractor, 
  CheckCircle2, 
  ArrowRight, 
  Apple, 
  Carrot, 
  Milk, 
  Flower2, 
  Wheat,
  Truck,
  ShieldCheck,
  RefreshCw,
  Server
} from 'lucide-react';
import { checkHealth } from '../services/api';

export const Home = () => {
  const [apiHealth, setApiHealth] = useState({ status: 'CHECKING', message: 'Connecting to backend...' });

  useEffect(() => {
    fetchHealthStatus();
  }, []);

  const fetchHealthStatus = async () => {
    setApiHealth({ status: 'CHECKING', message: 'Checking Spring Boot REST API health...' });
    try {
      const res = await checkHealth();
      setApiHealth({
        status: res.status || 'UP',
        message: res.message || 'Farmers Marketplace API is running'
      });
    } catch (err) {
      setApiHealth({
        status: 'DOWN',
        message: err.message || 'Backend offline (Ensure Spring Boot is running on port 8080)'
      });
    }
  };

  const categories = [
    { name: 'Fresh Vegetables', count: '45+ Varieties', icon: <Carrot size={28} color="var(--primary-800)" />, bg: 'var(--primary-100)' },
    { name: 'Organic Fruits', count: '30+ Varieties', icon: <Apple size={28} color="#d97706" />, bg: '#fef3c7' },
    { name: 'Dairy & Eggs', count: 'Farm Fresh Daily', icon: <Milk size={28} color="#0284c7" />, bg: '#e0f2fe' },
    { name: 'Honey & Preserves', count: 'Pure & Unfiltered', icon: <Flower2 size={28} color="var(--earth-600)" />, bg: 'var(--earth-100)' },
    { name: 'Grains & Pulses', count: 'Whole Grains', icon: <Wheat size={28} color="#b45309" />, bg: '#fef3c7' }
  ];

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* Backend API Health Alert Banner */}
      <div style={{
        backgroundColor: apiHealth.status === 'UP' ? 'var(--primary-100)' : apiHealth.status === 'CHECKING' ? '#fef3c7' : '#fee2e2',
        borderBottom: '1px solid var(--border-light)',
        padding: '0.6rem 1rem',
        fontSize: '0.875rem'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Server size={16} color={apiHealth.status === 'UP' ? 'var(--primary-800)' : apiHealth.status === 'CHECKING' ? '#b45309' : '#dc2626'} />
            <span>
              <strong>System Health Status:</strong> {apiHealth.message}
            </span>
          </div>
          <button
            onClick={fetchHealthStatus}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-900)' }}
          >
            <RefreshCw size={12} /> Re-check
          </button>
        </div>
      </div>

      {/* HERO SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(240, 253, 244, 0.9) 0%, rgba(247, 237, 226, 0.8) 100%)',
        padding: '4.5rem 0 5rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center'
        }}>
          <div>
            <div className="badge badge-green" style={{ marginBottom: '1.25rem' }}>
              <Sprout size={16} /> Direct-Selling Farm Marketplace
            </div>

            <h1 className="heading-serif" style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
              fontWeight: 700,
              color: 'var(--primary-900)',
              lineHeight: '1.15',
              marginBottom: '1.25rem'
            }}>
              Fresh From <span style={{ color: 'var(--primary-700)', fontStyle: 'italic' }}>Local Farmers</span> Directly To Your Doorstep
            </h1>

            <p style={{
              fontSize: '1.1rem',
              color: 'var(--text-muted)',
              marginBottom: '2.25rem',
              lineHeight: '1.7',
              maxWidth: '540px'
            }}>
              Support local agriculture by buying seasonal vegetables, fruits, and hand-crafted farm products directly from verified local growers—no middlemen, guaranteed freshness.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Link to="/register?role=CUSTOMER" className="btn btn-primary" style={{ padding: '0.9rem 1.8rem', fontSize: '1rem' }}>
                <ShoppingBag size={18} /> Browse Products
              </Link>
              <Link to="/register?role=FARMER" className="btn btn-secondary" style={{ padding: '0.9rem 1.8rem', fontSize: '1rem' }}>
                <Tractor size={18} /> Become a Farmer
              </Link>
            </div>

            <div style={{
              display: 'flex',
              gap: '1.75rem',
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-green)'
            }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-900)' }}>100%</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Direct From Farm</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-900)' }}>0</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Middlemen Fees</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-900)' }}>24h</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Harvest to Delivery</div>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div style={{ position: 'relative' }}>
            <div className="card glass-panel" style={{
              padding: '2.25rem',
              boxShadow: 'var(--shadow-lg)',
              border: '2px solid var(--border-green)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '1.5rem' }}>
                <span className="badge badge-earth">🌾 Today's Featured Harvest</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-800)' }}>Direct Selling</span>
              </div>

              <div style={{
                backgroundColor: 'var(--primary-50)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                border: '1px dashed var(--primary-500)'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '0.35rem' }}>
                  Organic Heirloom Tomatoes & Fresh Honey
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Harvested this morning by Green Acres Family Farm
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-800)' }}>$4.50 <span style={{ fontSize: '0.85rem', fontWeight: 400 }}>/ lb</span></span>
                  <span className="badge badge-green"><CheckCircle2 size={14} /> In Stock (120 lbs)</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  <ShieldCheck size={18} color="var(--primary-700)" /> Verified Local Farmer Credentials
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  <Truck size={18} color="var(--earth-600)" /> Direct Home Delivery & Pickup Points
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section className="container" style={{ padding: '4rem 1.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
          <span className="badge badge-green" style={{ marginBottom: '0.5rem' }}>Categories</span>
          <h2 className="heading-serif" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-900)' }}>
            Explore Farm Fresh Categories
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Discover locally produced crops, dairy, honey, and seasonal vegetables directly from local growers.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem'
        }}>
          {categories.map((cat, idx) => (
            <div key={idx} className="card" style={{ textAlign: 'center', padding: '1.75rem 1rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: cat.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                {cat.icon}
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--primary-900)' }}>
                {cat.name}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{cat.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{
        backgroundColor: '#f3f4f6',
        padding: '4.5rem 0',
        borderTop: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem auto' }}>
            <span className="badge badge-earth" style={{ marginBottom: '0.5rem' }}>Direct Supply Workflow</span>
            <h2 className="heading-serif" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-900)' }}>
              How The Marketplace Works
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Connecting hard-working local farmers with conscious local buyers in 4 simple steps.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem'
          }}>
            {[
              { step: '01', title: 'Farmers List Produce', desc: 'Local farmers set prices, upload harvest photos, and update daily stock levels.' },
              { step: '02', title: 'Customers Browse & Cart', desc: 'Buyers select fresh produce, add items to cart, and place orders directly.' },
              { step: '03', title: 'Secure Payment & Processing', desc: 'Orders are processed with secure JWT authentication and instant farmer notifications.' },
              { step: '04', title: 'Direct Delivery & Pickup', desc: 'Produce is harvested fresh and delivered or collected at designated pickup hubs.' }
            ].map((item, idx) => (
              <div key={idx} className="card" style={{ position: 'relative', borderTop: '4px solid var(--primary-600)' }}>
                <span style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: 'var(--primary-100)',
                  position: 'absolute',
                  top: '1rem',
                  right: '1.25rem'
                }}>
                  {item.step}
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '0.75rem', marginTop: '0.5rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS COMPARISON */}
      <section id="benefits" className="container" style={{ padding: '4.5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem auto' }}>
          <span className="badge badge-green" style={{ marginBottom: '0.5rem' }}>Value Proposition</span>
          <h2 className="heading-serif" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-900)' }}>
            Empowering Farmers & Delighting Customers
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem'
        }}>
          {/* Farmers Card */}
          <div className="card" style={{ backgroundColor: 'var(--primary-50)', border: '1.5px solid var(--border-green)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-800)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Tractor size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary-900)' }}>For Local Farmers</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Maximize profit & retain control</p>
              </div>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                'Keep 100% of fair produce pricing without broker margins',
                'Real-time inventory control and batch stock management',
                'Direct customer relationship building & order tracking',
                'Transparent payout schedules & sales analytics dashboard'
              ].map((text, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} color="var(--primary-700)" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: '2rem' }}>
              <Link to="/register?role=FARMER" className="btn btn-primary" style={{ width: '100%' }}>
                Register as a Farmer <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Customers Card */}
          <div className="card" style={{ backgroundColor: 'var(--earth-100)', border: '1.5px solid rgba(141, 91, 76, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--earth-800)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingBag size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--earth-800)' }}>For Fresh Food Buyers</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Healthier, fresher, fully transparent</p>
              </div>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                'Peak freshness: harvest to delivery within hours',
                'Full transparency on farm origins, practices, and grower info',
                'Support your local agricultural economy & reduce carbon footprint',
                'Convenient online ordering, delivery tracking, and reviews'
              ].map((text, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} color="var(--earth-600)" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: '2rem' }}>
              <Link to="/register?role=CUSTOMER" className="btn btn-secondary" style={{ width: '100%' }}>
                Join as a Customer <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
