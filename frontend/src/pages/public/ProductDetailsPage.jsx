import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Heart, 
  Check, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Calendar, 
  ArrowLeft,
  Award,
  ChevronRight,
  Info
} from 'lucide-react';
import Rating from '../../components/common/Rating';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import ProductCard from '../../components/product/ProductCard';
import { MOCK_PRODUCTS, MOCK_FARMERS, MOCK_REVIEWS } from '../../utils/mockData';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const product = MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0];
  const farmer = MOCK_FARMERS.find((f) => f.id === product.farmerId) || MOCK_FARMERS[0];
  const relatedProducts = MOCK_PRODUCTS.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleToggleWishlist = () => {
    setInWishlist(!inWishlist);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-app)', paddingBottom: '6rem' }}>
      
      {/* Breadcrumbs Navigation */}
      <div style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--primary-800)', fontWeight: '600' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to="/products" style={{ color: 'var(--primary-800)', fontWeight: '600' }}>Produce Catalog</Link>
          <ChevronRight size={14} />
          <Link to={`/products?category=${product.categoryId}`} style={{ color: 'var(--text-muted)' }}>{product.categoryName}</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{product.name}</span>
        </div>
      </div>

      <div className="container" style={{ marginTop: '2.5rem' }}>
        
        {/* Main Product Hero Details (2 Columns) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '3rem',
          backgroundColor: 'var(--bg-surface)',
          padding: '2.5rem',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-light)',
          marginBottom: '3rem'
        }} className="product-details-grid">
          
          {/* Left Column: Product Image Gallery */}
          <div>
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              height: '420px',
              backgroundColor: '#f1f5f9',
              border: '1px solid var(--border-light)'
            }}>
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {product.isOrganic && (
                  <Badge variant="organic" style={{ padding: '0.35rem 0.85rem', fontSize: '0.8125rem' }}>
                    <Sparkles size={14} /> 100% Certified Organic
                  </Badge>
                )}
                <Badge variant={product.status === 'LOW_STOCK' ? 'lowstock' : 'instock'} style={{ padding: '0.35rem 0.85rem', fontSize: '0.8125rem' }}>
                  {product.status === 'LOW_STOCK' ? 'Low Harvest Stock' : 'In Stock & Fresh'}
                </Badge>
              </div>
            </div>

            {/* Quality Guarantees Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              marginTop: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)' }}>
                <Calendar size={20} color="var(--primary-700)" />
                <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--primary-900)' }}>
                  Harvested: {product.harvestDate}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)' }}>
                <Truck size={20} color="var(--primary-700)" />
                <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--primary-900)' }}>
                  Dispatched in 24 Hours
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Purchase Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Category & Verified Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <span style={{
                  fontSize: '0.8125rem',
                  fontWeight: '700',
                  color: 'var(--primary-700)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em'
                }}>
                  {product.categoryName}
                </span>
                <span style={{ color: 'var(--text-light)' }}>•</span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={13} color="var(--earth-600)" /> {product.location}
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
                {product.name}
              </h1>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <Rating value={product.rating} count={product.reviewsCount} size={18} />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  ({product.reviewsCount} verified customer reviews)
                </span>
              </div>

              {/* Price Banner */}
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.75rem',
                padding: '1.25rem 1.5rem',
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.75rem',
                border: '1px solid var(--border-light)'
              }}>
                <span style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--primary-900)' }}>
                  ₹{product.price}
                </span>
                <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  per {product.unit}
                </span>
                {product.originalPrice && (
                  <span style={{ fontSize: '1.125rem', color: 'var(--text-light)', textDecoration: 'line-through', marginLeft: '0.5rem' }}>
                    ₹{product.originalPrice}
                  </span>
                )}
                <span style={{
                  marginLeft: 'auto',
                  fontSize: '0.8125rem',
                  fontWeight: '700',
                  color: '#15803d',
                  backgroundColor: '#dcfce7',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)'
                }}>
                  Farm Gate Direct Price
                </span>
              </div>

              {/* Short Description */}
              <p style={{ fontSize: '1rem', color: 'var(--text-body)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                {product.description}
              </p>

              {/* Nutritional Highlights */}
              {product.nutrition && (
                <div style={{
                  padding: '0.85rem 1.25rem',
                  backgroundColor: '#fef3c7',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem'
                }}>
                  <Info size={18} color="#b45309" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem', color: '#92400e', fontWeight: '600' }}>
                    {product.nutrition}
                  </span>
                </div>
              )}
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div>
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
                    style={{
                      width: '40px',
                      height: '40px',
                      border: 'none',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      fontSize: '1.25rem',
                      cursor: 'pointer',
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
                    onClick={() => setQuantity(quantity + 1)}
                    style={{
                      width: '40px',
                      height: '40px',
                      border: 'none',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      fontSize: '1.25rem',
                      cursor: 'pointer',
                      fontWeight: '700',
                      color: 'var(--primary-900)'
                    }}
                  >
                    +
                  </button>
                </div>

                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Total: <strong style={{ color: 'var(--primary-900)', fontSize: '1.1rem' }}>₹{product.price * quantity}</strong>
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button
                  variant={addedToCart ? 'success' : 'primary'}
                  size="lg"
                  onClick={handleAddToCart}
                  icon={addedToCart ? <Check size={20} /> : <ShoppingCart size={20} />}
                  style={{ flex: '1 1 220px', backgroundColor: addedToCart ? '#15803d' : 'var(--primary-800)' }}
                >
                  {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
                </Button>

                <Button
                  variant={inWishlist ? 'accent' : 'outline'}
                  size="lg"
                  onClick={handleToggleWishlist}
                  icon={<Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />}
                >
                  {inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>
            </div>

          </div>

        </div>

        {/* 2. ABOUT THE FARMER CARD */}
        <div className="card" style={{
          padding: '2.5rem',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '3rem',
          borderLeft: '6px solid var(--primary-600)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
            <img
              src={farmer.avatar}
              alt={farmer.name}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: 'var(--radius-full)',
                objectFit: 'cover',
                border: '3px solid var(--primary-300)'
              }}
            />

            <div style={{ flex: '1 1 300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="badge badge-category">Verified Local Producer</span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>• {farmer.experienceYears} Years Farming</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-900)', marginBottom: '0.25rem' }}>
                {farmer.farmName}
              </h2>
              <p style={{ fontSize: '0.9375rem', fontWeight: '600', color: 'var(--earth-800)', marginBottom: '0.75rem' }}>
                Cultivated by Farmer: {farmer.name} ({farmer.location})
              </p>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-body)', lineHeight: '1.6' }}>
                {farmer.bio}
              </p>
            </div>
          </div>
        </div>

        {/* 3. CUSTOMER REVIEWS & RATINGS */}
        <div className="card" style={{
          padding: '2.5rem',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '4rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-light)'
          }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-900)' }}>
                Customer Ratings & Feedback
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Real experiences from verified local consumers
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-900)' }}>{product.rating}</span>
              <Rating value={product.rating} showNumeric={false} size={18} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {MOCK_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                style={{
                  padding: '1.25rem',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div>
                    <strong style={{ fontSize: '0.9375rem', color: 'var(--primary-900)' }}>{rev.userName}</strong>
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#059669', fontWeight: '600' }}>✓ {rev.userRole}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{rev.date}</span>
                </div>
                <Rating value={rev.rating} showNumeric={false} size={13} />
                <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', marginTop: '0.5rem', lineHeight: '1.5' }}>
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. RELATED CROPS */}
        {relatedProducts.length > 0 && (
          <div>
            <div style={{ marginBottom: '1.75rem' }}>
              <span className="section-tag">Explore More</span>
              <h2 className="section-title" style={{ fontSize: '1.8rem' }}>Related Farm Crops</h2>
            </div>
            <div className="grid-products">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

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
