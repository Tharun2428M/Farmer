import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, MapPin, Sparkles, Store, PackageX } from 'lucide-react';
import Rating from '../common/Rating';
import Badge from '../common/Badge';
import Button from '../common/Button';

export const ProductCard = ({ product }) => {
  if (!product) return null;

  // Normalized properties supporting backend DTO or fallback
  const id = product.id;
  const title = product.title || product.name || 'Fresh Produce';
  const description = product.description || '';
  const price = product.pricePerUnit ?? product.price ?? 0;
  const unit = product.unit || 'kg';
  const imageUrl = product.imageUrl || product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60';
  
  const categoryName = product.category?.name || product.categoryName || 'Agricultural Produce';
  const farmerName = product.farmer?.name || product.farmerName || 'Local Grower';
  const farmName = product.farmer?.farmName || product.farmName || '';
  const location = product.farmer?.location || product.location || 'Maharashtra, India';
  const rating = product.farmer?.rating ? Number(product.farmer.rating) : (product.rating || 4.8);

  const stockQuantity = product.stockQuantity ?? 0;
  const lowStockThreshold = product.lowStockThreshold ?? 5;
  const isOutOfStock = stockQuantity === 0;
  const isLowStock = !isOutOfStock && stockQuantity <= lowStockThreshold;

  return (
    <div className="card product-card" style={{
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      height: '100%',
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-light)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Product Image Box */}
      <Link to={`/products/${id}`} style={{ position: 'relative', overflow: 'hidden', display: 'block', height: '210px', backgroundColor: '#f1f5f9' }}>
        <img
          src={imageUrl}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform var(--transition-smooth)'
          }}
          className="product-card-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60';
          }}
        />

        {/* Top Left Badge */}
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          left: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          zIndex: 2
        }}>
          <Badge variant="organic">
            <Sparkles size={11} /> Farm Direct
          </Badge>
        </div>

        {/* Stock Status Pill */}
        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 2 }}>
          {isOutOfStock ? (
            <span style={{
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              fontSize: '0.6875rem',
              fontWeight: '800',
              padding: '0.2rem 0.55rem',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <PackageX size={12} /> Out of Stock
            </span>
          ) : isLowStock ? (
            <span style={{
              backgroundColor: '#fef3c7',
              color: '#92400e',
              fontSize: '0.6875rem',
              fontWeight: '800',
              padding: '0.2rem 0.55rem',
              borderRadius: 'var(--radius-full)'
            }}>
              Only {stockQuantity} {unit} left
            </span>
          ) : (
            <span style={{
              backgroundColor: '#dcfce7',
              color: '#166534',
              fontSize: '0.6875rem',
              fontWeight: '800',
              padding: '0.2rem 0.55rem',
              borderRadius: 'var(--radius-full)'
            }}>
              In Stock ({stockQuantity} {unit})
            </span>
          )}
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
              {categoryName}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }} title={location}>
              <MapPin size={12} color="var(--earth-600)" />
              <span style={{ maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {location}
              </span>
            </span>
          </div>

          {/* Product Title */}
          <Link to={`/products/${id}`}>
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
              {title}
            </h3>
          </Link>

          {/* Farmer Attribution */}
          <p style={{ fontSize: '0.8125rem', color: 'var(--earth-800)', fontWeight: '500', marginBottom: '0.65rem' }}>
            <Store size={13} style={{ display: 'inline', marginRight: '0.3rem', color: 'var(--primary-700)' }} />
            {farmName ? farmName : `Farmer: ${farmerName}`}
          </p>

          {/* Rating */}
          <div style={{ marginBottom: '0.85rem' }}>
            <Rating value={rating} count={24} size={14} />
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
              ₹{price}
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: '500' }}>
              / {unit}
            </span>
          </div>

          {/* View Details Action Button */}
          <div>
            <Link to={`/products/${id}`} style={{ width: '100%', textDecoration: 'none' }}>
              <Button
                variant={isOutOfStock ? 'outline' : 'primary'}
                size="sm"
                fullWidth
                icon={<Eye size={16} />}
              >
                {isOutOfStock ? 'View Availability' : 'View Farm Produce'}
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
