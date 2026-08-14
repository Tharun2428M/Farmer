import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check, Eye, MapPin, Sparkles } from 'lucide-react';
import Rating from '../common/Rating';
import Badge from '../common/Badge';
import Button from '../common/Button';

export const ProductCard = ({ product }) => {
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="card product-card" style={{
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      height: '100%',
      backgroundColor: 'var(--bg-surface)'
    }}>
      {/* Product Image Box */}
      <Link to={`/products/${product.id}`} style={{ position: 'relative', overflow: 'hidden', display: 'block', height: '200px', backgroundColor: '#f1f5f9' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform var(--transition-smooth)'
          }}
          className="product-card-img"
          loading="lazy"
        />

        {/* Top Badges */}
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          left: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          zIndex: 2
        }}>
          {product.isOrganic && (
            <Badge variant="organic">
              <Sparkles size={11} /> Organic
            </Badge>
          )}
          {discount > 0 && (
            <span style={{
              backgroundColor: 'var(--accent-orange)',
              color: 'white',
              fontSize: '0.6875rem',
              fontWeight: '800',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-full)'
            }}>
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Stock Status Pill */}
        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 2 }}>
          <Badge variant={product.status === 'LOW_STOCK' ? 'lowstock' : 'instock'}>
            {product.status === 'LOW_STOCK' ? 'Low Stock' : 'Fresh Harvest'}
          </Badge>
        </div>
      </Link>

      {/* Card Body */}
      <div style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-between'
      }}>
        <div>
          {/* Category & Location */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginBottom: '0.4rem'
          }}>
            <span style={{ fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary-700)' }}>
              {product.categoryName}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <MapPin size={12} color="var(--earth-600)" />
              {product.location}
            </span>
          </div>

          {/* Product Title */}
          <Link to={`/products/${product.id}`}>
            <h3 style={{
              fontSize: '1.0625rem',
              fontWeight: '700',
              color: 'var(--primary-900)',
              lineHeight: '1.3',
              marginBottom: '0.4rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }} className="product-title-hover">
              {product.name}
            </h3>
          </Link>

          {/* Farmer Attribution */}
          <p style={{ fontSize: '0.8125rem', color: 'var(--earth-800)', fontWeight: '500', marginBottom: '0.65rem' }}>
            Farmer: <strong style={{ color: 'var(--primary-900)' }}>{product.farmerName}</strong>
          </p>

          {/* Rating */}
          <div style={{ marginBottom: '0.85rem' }}>
            <Rating value={product.rating} count={product.reviewsCount} size={14} />
          </div>
        </div>

        {/* Price & Action Row */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '0.5rem',
            marginBottom: '1rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <span style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--primary-900)' }}>
              ₹{product.price}
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: '500' }}>
              / {product.unit}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: '0.875rem', color: 'var(--text-light)', textDecoration: 'line-through', marginLeft: 'auto' }}>
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem' }}>
            <Button
              variant={added ? 'success' : 'primary'}
              size="sm"
              fullWidth
              onClick={handleAddToCart}
              icon={added ? <Check size={16} /> : <ShoppingCart size={16} />}
              style={{ backgroundColor: added ? '#15803d' : 'var(--primary-800)' }}
            >
              {added ? 'Added to Cart' : 'Add to Cart'}
            </Button>

            <Link to={`/products/${product.id}`} title="View Details">
              <Button variant="outline" size="sm" style={{ padding: '0.4rem 0.65rem' }}>
                <Eye size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .product-card:hover .product-card-img {
          transform: scale(1.05);
        }
        .product-title-hover:hover {
          color: var(--primary-700);
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
