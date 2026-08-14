import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Tractor, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Leaf,
  Users,
  Award,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import SearchBar from '../../components/common/SearchBar';
import Button from '../../components/common/Button';
import ProductCard from '../../components/product/ProductCard';
import CategoryCard from '../../components/category/CategoryCard';
import productService from '../../services/productService';
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_STATS } from '../../utils/mockData';

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const [prodData, catData] = await Promise.allSettled([
          productService.getPublicProducts({ size: 8, sort: 'newest' }),
          productService.getCategories()
        ]);

        if (prodData.status === 'fulfilled' && prodData.value?.content?.length > 0) {
          setFeaturedProducts(prodData.value.content);
        } else {
          setFeaturedProducts(MOCK_PRODUCTS.slice(0, 8));
        }

        if (catData.status === 'fulfilled' && catData.value?.length > 0) {
          setCategories(catData.value.slice(0, 6));
        } else {
          setCategories(MOCK_CATEGORIES.slice(0, 6));
        }
      } catch (err) {
        console.error('Home data load fallback:', err);
        setFeaturedProducts(MOCK_PRODUCTS.slice(0, 8));
        setCategories(MOCK_CATEGORIES.slice(0, 6));
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleSearchSubmit = (query) => {
    if (query && query.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        backgroundColor: 'var(--primary-900)',
        color: 'white',
        paddingTop: '5rem',
        paddingBottom: '6rem',
        backgroundImage: 'radial-gradient(circle at top right, rgba(82, 183, 136, 0.25) 0%, transparent 60%)',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '3rem',
            alignItems: 'center'
          }} className="hero-grid">
            
            {/* Left Content */}
            <div style={{ maxWidth: '640px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8125rem',
                fontWeight: '700',
                color: 'var(--primary-300)',
                marginBottom: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}>
                <Sparkles size={14} color="var(--accent-gold)" /> Direct-from-Farm Marketplace
              </div>

              <h1 style={{
                fontSize: '2.75rem',
                fontWeight: '800',
                lineHeight: '1.15',
                letterSpacing: '-0.02em',
                marginBottom: '1.25rem',
                color: '#ffffff'
              }} className="hero-title">
                Fresh Local Produce, <br />
                <span style={{ color: 'var(--primary-500)' }}>Direct from Farmers</span>
              </h1>

              <p style={{
                fontSize: '1.125rem',
                color: '#cbd5e1',
                lineHeight: '1.6',
                marginBottom: '2.25rem'
              }}>
                Skip wholesale intermediaries. Connect with certified local growers in your region for chemical-free vegetables, heirloom grains, and orchard-fresh fruits delivered straight to your doorstep.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
                <Link to="/products">
                  <Button variant="accent" size="lg" icon={<ShoppingBag size={19} />}>
                    Shop Fresh Harvest
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline" size="lg" icon={<Tractor size={19} />} style={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.4)' }}>
                    Sell Your Produce
                  </Button>
                </Link>
              </div>

              {/* Quick Search */}
              <div style={{ maxWidth: '540px' }}>
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onClear={() => setSearchQuery('')}
                  onSubmit={handleSearchSubmit}
                  placeholder="Search fresh tomatoes, spinach, organic honey..."
                />
              </div>
            </div>

            {/* Right Hero Visual Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }} className="hero-cards-grid">
              <div className="card" style={{ padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.95)', color: 'var(--text-main)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
                  <Leaf size={22} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-900)' }}>{MOCK_STATS.freshProducts}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600' }}>Active Harvests Listed</p>
              </div>

              <div className="card" style={{ padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.95)', color: 'var(--text-main)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: '#fff3e0', color: '#e65100', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
                  <Users size={22} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-900)' }}>{MOCK_STATS.activeFarmers}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600' }}>Verified Local Growers</p>
              </div>

              <div className="card" style={{ padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.95)', color: 'var(--text-main)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
                  <Award size={22} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-900)' }}>{MOCK_STATS.fairPriceGuarantee}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600' }}>Fair Direct Pricing</p>
              </div>

              <div className="card" style={{ padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.95)', color: 'var(--text-main)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
                  <TrendingUp size={22} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-900)' }}>{MOCK_STATS.happyFamilies}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600' }}>Families Supported</p>
              </div>
            </div>

          </div>
        </div>

        <style>{`
          @media (min-width: 960px) {
            .hero-grid { grid-template-columns: 1.15fr 0.85fr !important; }
            .hero-title { font-size: 3.5rem !important; }
          }
        `}</style>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Explore Harvest Categories</span>
            <h2 className="section-title">Farm-Fresh Agricultural Goods</h2>
            <p className="section-subtitle">
              Browse directly by crop variety, hand-tended with natural farming methods and harvested at peak freshness.
            </p>
          </div>

          <div className="grid-categories">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/products">
              <Button variant="outline" icon={<ArrowRight size={16} />} iconPosition="right">
                View All Produce
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-app)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '2.5rem'
          }}>
            <div>
              <span className="section-tag">Today's Harvest</span>
              <h2 className="section-title" style={{ marginBottom: '0.25rem' }}>Featured Fresh Produce</h2>
              <p className="section-subtitle">Picked early morning, packed naturally, ready for your home.</p>
            </div>
            <Link to="/products">
              <Button variant="secondary" icon={<ArrowRight size={16} />} iconPosition="right">
                Explore Full Catalog
              </Button>
            </Link>
          </div>

          <div className="grid-products">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Simple & Transparent</span>
            <h2 className="section-title">How Our Direct Marketplace Works</h2>
            <p className="section-subtitle">
              A seamless bridge connecting local farm fields directly to consumer dining tables.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem'
          }}>
            {/* Step 1 */}
            <div className="card" style={{ padding: '2.25rem 1.75rem', textAlign: 'center', borderTop: '4px solid var(--primary-600)' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary-100)',
                color: 'var(--primary-800)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                fontSize: '1.25rem',
                fontWeight: '800'
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.65rem' }}>
                Farmers Harvest & List
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Verified local growers list daily harvest availability, crop variety, and transparent farm gate prices directly.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ padding: '2.25rem 1.75rem', textAlign: 'center', borderTop: '4px solid var(--accent-orange)' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: '#fff3e0',
                color: '#e65100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                fontSize: '1.25rem',
                fontWeight: '800'
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.65rem' }}>
                You Order Farm-Fresh
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Choose products knowing the exact farmer and location. Add to cart with zero hidden middleman commissions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ padding: '2.25rem 1.75rem', textAlign: 'center', borderTop: '4px solid var(--primary-700)' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary-100)',
                color: 'var(--primary-800)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                fontSize: '1.25rem',
                fontWeight: '800'
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.65rem' }}>
                Direct Express Delivery
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Produce is picked at dawn and dispatched in eco-friendly packaging, ensuring maximum nutrient retention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY BUY DIRECT & WHY FARMERS JOIN */}
      <section className="section-padding" style={{ backgroundColor: 'var(--primary-50)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem'
          }}>
            {/* Why Buy Direct (Consumers) */}
            <div className="card" style={{ padding: '2.5rem', backgroundColor: 'var(--bg-surface)' }}>
              <span className="badge badge-organic" style={{ marginBottom: '1rem' }}>For Consumers</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary-900)', marginBottom: '1.25rem' }}>
                Why Buy Directly from Farmers?
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9375rem' }}>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={20} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Unmatched 24-Hour Freshness:</strong> Crops harvested right before dispatch instead of sitting weeks in cold wholesale warehouses.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={20} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>100% Origin Traceability:</strong> Know exactly which farmer cultivated your food and where their farm is located.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={20} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Empower Agrarian Families:</strong> 100% of the produce price goes directly to support local farmers and rural youth.
                  </div>
                </li>
              </ul>
            </div>

            {/* Why Farmers Join */}
            <div className="card" style={{ padding: '2.5rem', backgroundColor: 'var(--bg-surface)' }}>
              <span className="badge badge-category" style={{ marginBottom: '1rem' }}>For Farmers</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary-900)', marginBottom: '1.25rem' }}>
                Why Farmers Should Join Us?
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9375rem' }}>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={20} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Zero Intermediary Exploitation:</strong> Set your own prices without losing up to 40% of margins to middlemen.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={20} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Guaranteed Direct Payouts:</strong> Receive fast and secure digital payments for your harvest.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={20} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Loyal Consumer Community:</strong> Build repeat customer relationships that value organic cultivation.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section style={{
        backgroundColor: 'var(--primary-900)',
        color: 'white',
        padding: '5rem 0',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div className="container" style={{ maxWidth: '750px' }}>
          <span style={{
            display: 'inline-block',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '0.35rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8125rem',
            fontWeight: '700',
            color: 'var(--primary-300)',
            marginBottom: '1rem',
            textTransform: 'uppercase'
          }}>
            Join The Direct Agricultural Revolution
          </span>

          <h2 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '1rem', color: '#ffffff' }}>
            Ready to Taste Real Farm Freshness?
          </h2>

          <p style={{ fontSize: '1.0625rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '2rem' }}>
            Explore fresh seasonal vegetables, fruits, and cold-pressed honey from trusted regional farmers today.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/products">
              <Button variant="accent" size="lg" icon={<ShoppingBag size={18} />}>
                Browse Produce Catalog
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" size="lg" style={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.4)' }}>
                Register Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
