import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Heart, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Calendar, 
  ArrowLeft,
  ChevronRight,
  Info,
  Store,
  User,
  PackageCheck,
  PackageX,
  AlertCircle,
  Star
} from 'lucide-react';
import productService from '../../services/productService';
import Rating from '../../components/common/Rating';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [phase9Alert, setPhase9Alert] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await productService.getPublicProductById(id);
        setProduct(data);
      } catch (err) {
        console.error('Failed to load product details:', err);
        if (err.response?.status === 404) {
          setError('This agricultural produce listing does not exist or has been deactivated.');
        } else {
          setError(err.response?.data?.message || 'Could not load product details.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleCartClick = () => {
    setPhase9Alert(true);
    setTimeout(() => setPhase9Alert(false), 3500);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-24">
        <LoadingSpinner text="Harvesting farm product details..." size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] py-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 text-center shadow-lg space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Produce Not Found</h2>
          <p className="text-sm text-slate-600">
            {error || 'The requested produce item is unavailable.'}
          </p>
          <div className="pt-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse All Produce
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stockQuantity = product.stockQuantity ?? 0;
  const lowStockThreshold = product.lowStockThreshold ?? 5;
  const isOutOfStock = stockQuantity === 0;
  const isLowStock = !isOutOfStock && stockQuantity <= lowStockThreshold;

  const farmer = product.farmer || {};
  const category = product.category || {};
  const rating = farmer.rating ? Number(farmer.rating) : 4.9;

  return (
    <div style={{ backgroundColor: 'var(--bg-app)', paddingBottom: '6rem' }}>
      
      {/* Breadcrumbs Navigation */}
      <div style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--primary-800)', fontWeight: '600' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to="/products" style={{ color: 'var(--primary-800)', fontWeight: '600' }}>Produce Marketplace</Link>
          <ChevronRight size={14} />
          {category.id && (
            <>
              <Link to={`/products?categoryId=${category.id}`} style={{ color: 'var(--text-muted)' }}>{category.name}</Link>
              <ChevronRight size={14} />
            </>
          )}
          <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{product.title}</span>
        </div>
      </div>

      <div className="container" style={{ marginTop: '2.5rem' }}>
        
        {/* Main Product Hero Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '3rem',
          backgroundColor: 'var(--bg-surface)',
          padding: '2.5rem',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-light)',
          marginBottom: '3rem'
        }} className="product-details-grid">
          
          {/* Left Column: Product Image Gallery */}
          <div>
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              height: '420px',
              backgroundColor: '#f1f5f9',
              border: '1px solid var(--border-light)'
            }}>
              <img
                src={product.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80'}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80';
                }}
              />

              {/* Badges */}
              <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Badge variant="organic" style={{ padding: '0.35rem 0.85rem', fontSize: '0.8125rem' }}>
                  <Sparkles size={14} /> 100% Farm Fresh
                </Badge>
                {isOutOfStock ? (
                  <span style={{
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    fontSize: '0.8125rem',
                    fontWeight: '800',
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}>
                    <PackageX size={14} /> Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span style={{
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    fontSize: '0.8125rem',
                    fontWeight: '800',
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    Only {stockQuantity} {product.unit} left!
                  </span>
                ) : (
                  <span style={{
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    fontSize: '0.8125rem',
                    fontWeight: '800',
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}>
                    <PackageCheck size={14} /> In Stock ({stockQuantity} {product.unit})
                  </span>
                )}
              </div>
            </div>

            {/* Quality Highlights Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              marginTop: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem 1rem', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)' }}>
                <ShieldCheck size={20} color="var(--primary-700)" />
                <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--primary-900)' }}>
                  Verified Grower
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem 1rem', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)' }}>
                <Truck size={20} color="var(--primary-700)" />
                <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--primary-900)' }}>
                  Direct Farm Dispatch
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Purchase Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Category & Farm Location */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <span style={{
                  fontSize: '0.8125rem',
                  fontWeight: '700',
                  color: 'var(--primary-700)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em'
                }}>
                  {category.name || 'Produce'}
                </span>
                <span style={{ color: 'var(--text-light)' }}>•</span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={13} color="var(--earth-600)" /> {farmer.location || 'Maharashtra, India'}
                </span>
              </div>

              {/* Title */}
              <h1 style={{
                fontSize: '2.25rem',
                fontWeight: '800',
                color: 'var(--primary-900)',
                lineHeight: '1.25',
                marginBottom: '0.75rem'
              }}>
                {product.title}
              </h1>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Rating value={rating} count={28} size={18} />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  ({rating.toFixed(1)} farmer rating)
                </span>
              </div>

              {/* Price Banner */}
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.75rem',
                padding: '1.25rem 1.5rem',
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-xl)',
                marginBottom: '1.75rem',
                border: '1px solid var(--border-light)'
              }}>
                <span style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--primary-900)' }}>
                  ₹{product.pricePerUnit}
                </span>
                <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  per {product.unit}
                </span>
                <span style={{
                  marginLeft: 'auto',
                  fontSize: '0.8125rem',
                  fontWeight: '700',
                  color: '#15803d',
                  backgroundColor: '#dcfce7',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-full)'
                }}>
                  Zero Middleman Price
                </span>
              </div>

              {/* Description */}
              <p style={{ fontSize: '1rem', color: 'var(--text-body)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                {product.description || 'Fresh agricultural produce plucked straight from the farm soil.'}
              </p>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div>
              {/* Phase 9 Feature Alert Notification */}
              {phase9Alert && (
                <div style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fde68a',
                  borderRadius: 'var(--radius-lg)',
                  color: '#92400e',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Info size={16} />
                  <span>Cart & Order Checkout will be unlocked in Phase 9!</span>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.9375rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  Quantity ({product.unit}):
                </span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1.5px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden'
                }}>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock}
                    style={{
                      width: '40px',
                      height: '40px',
                      border: 'none',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      fontSize: '1.25rem',
                      cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                      fontWeight: '700',
                      color: 'var(--primary-900)'
                    }}
                  >
                    -
                  </button>
                  <span style={{
                    width: '50px',
                    textAlign: 'center',
                    fontWeight: '700',
                    fontSize: '1rem'
                  }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(stockQuantity || 1, quantity + 1))}
                    disabled={isOutOfStock || quantity >= stockQuantity}
                    style={{
                      width: '40px',
                      height: '40px',
                      border: 'none',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      fontSize: '1.25rem',
                      cursor: (isOutOfStock || quantity >= stockQuantity) ? 'not-allowed' : 'pointer',
                      fontWeight: '700',
                      color: 'var(--primary-900)'
                    }}
                  >
                    +
                  </button>
                </div>

                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Total: <strong style={{ color: 'var(--primary-900)', fontSize: '1.1rem' }}>₹{(product.pricePerUnit * quantity).toFixed(2)}</strong>
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button
                  variant="primary"
                  size="lg"
                  disabled={isOutOfStock}
                  onClick={handleCartClick}
                  icon={<ShoppingCart size={20} />}
                  style={{ flex: '1 1 220px', opacity: isOutOfStock ? 0.6 : 1 }}
                >
                  {isOutOfStock ? 'Currently Out of Stock' : 'Add to Cart (Phase 9)'}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleCartClick}
                  icon={<Heart size={20} />}
                >
                  Wishlist (Phase 9)
                </Button>
              </div>
            </div>

          </div>

        </div>

        {/* 2. ABOUT THE GROWER / FARM CARD */}
        {farmer.farmName && (
          <div className="card" style={{
            padding: '2.5rem',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-2xl)',
            marginBottom: '3rem',
            borderLeft: '6px solid var(--primary-600)',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-800)',
                flexShrink: 0
              }}>
                <Store size={40} />
              </div>

              <div style={{ flex: '1 1 300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className="badge badge-category" style={{ backgroundColor: 'var(--primary-100)', color: 'var(--primary-900)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '700' }}>
                    Verified Farm Grower
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>• {farmer.location}</span>
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-900)', marginBottom: '0.25rem' }}>
                  {farmer.farmName}
                </h2>
                <p style={{ fontSize: '0.9375rem', fontWeight: '600', color: 'var(--earth-800)', marginBottom: '0.5rem' }}>
                  Cultivated by: {farmer.name}
                </p>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-body)', lineHeight: '1.6' }}>
                  {farmer.description || 'Practices natural organic farming with non-chemical pest prevention and nutrient-rich soil composting.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. CUSTOMER FEEDBACK PLACEHOLDER */}
        <div className="card" style={{
          padding: '2.5rem',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-2xl)',
          border: '1px solid var(--border-light)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-light)'
          }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-900)' }}>
                Customer Ratings & Reviews
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Direct consumer feedback verified upon order completion
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary-900)' }}>{rating.toFixed(1)}</span>
              <Rating value={rating} showNumeric={false} size={16} />
            </div>
          </div>

          <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Verified order reviews and customer ratings will be activated with consumer orders in subsequent phases.
            </p>
          </div>
        </div>

      </div>

      <style>{`
        @media (min-width: 900px) {
          .product-details-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetailsPage;
