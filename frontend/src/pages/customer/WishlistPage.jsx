import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Eye, 
  ArrowLeft, 
  Store, 
  Sparkles, 
  AlertCircle,
  PackageCheck,
  PackageX,
  Check
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const WishlistPage = () => {
  const { wishlist, addToCart, removeFromWishlist, loading } = useCart();
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddToCartFromWishlist = async (item, removeFromWishlistAfter = false) => {
    setErrorMessage('');
    setSuccessMessage('');
    setActionLoadingId(item.productId);
    try {
      await addToCart(item.productId, 1);
      if (removeFromWishlistAfter) {
        await removeFromWishlist(item.productId);
        setSuccessMessage(`Moved "${item.title}" to your cart!`);
      } else {
        setSuccessMessage(`Added "${item.title}" to your cart!`);
      }
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to add item to cart.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRemove = async (productId) => {
    setErrorMessage('');
    setSuccessMessage('');
    setActionLoadingId(productId);
    try {
      await removeFromWishlist(productId);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to remove product from wishlist.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-app)', minHeight: '80vh', paddingBottom: '6rem' }}>
      
      {/* Page Banner */}
      <div style={{
        backgroundColor: 'var(--primary-900)',
        color: 'white',
        padding: '2.5rem 0',
        marginBottom: '2rem'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-300)', fontSize: '0.8125rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              <Heart size={16} fill="currentColor" /> Saved Harvests
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Your Saved Wishlist</h1>
          </div>
          <Link to="/products">
            <Button variant="outline" size="sm" icon={<ArrowLeft size={16} />} style={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.4)' }}>
              Explore Produce
            </Button>
          </Link>
        </div>
      </div>

      <div className="container">

        {/* Success / Error Alerts */}
        {successMessage && (
          <div style={{
            padding: '0.85rem 1.25rem',
            backgroundColor: '#dcfce7',
            border: '1px solid #bbf7d0',
            color: '#166534',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>
            <Check size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div style={{
            padding: '0.85rem 1.25rem',
            backgroundColor: '#fff1f2',
            border: '1px solid #fecdd3',
            color: '#be123c',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}>
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {wishlist.length === 0 ? (
          /* Empty Wishlist State */
          <div style={{
            padding: '5rem 2rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-2xl)',
            border: '1px solid var(--border-light)',
            maxWidth: '600px',
            margin: '2rem auto'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#ffe4e6',
              color: '#e11d48',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <Heart size={40} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
              Your wishlist is empty
            </h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.75rem' }}>
              Save seasonal produce you love to your wishlist to order when you're ready.
            </p>
            <Link to="/products">
              <Button variant="primary" size="lg" icon={<Sparkles size={18} />}>
                Browse Marketplace Produce
              </Button>
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {wishlist.map((item) => {
              const isOutOfStock = !item.isAvailable || item.stockQuantity === 0;
              const isItemLoading = actionLoadingId === item.productId;

              return (
                <div
                  key={item.id}
                  className="card"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-2xl)',
                    border: '1px solid var(--border-light)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    opacity: isItemLoading ? 0.6 : 1
                  }}
                >
                  {/* Thumbnail Image */}
                  <div style={{ position: 'relative', height: '180px', backgroundColor: '#f1f5f9' }}>
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=60'}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=60';
                      }}
                    />

                    {/* Stock Status Badge */}
                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                      {isOutOfStock ? (
                        <span style={{ backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '0.6875rem', fontWeight: '800', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                          Out of Stock
                        </span>
                      ) : (
                        <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.6875rem', fontWeight: '800', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                          In Stock ({item.stockQuantity} {item.unit})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                    <div>
                      <Link to={`/products/${item.productId}`} style={{ textDecoration: 'none' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.3rem' }}>
                          {item.title}
                        </h3>
                      </Link>

                      <p style={{ fontSize: '0.8125rem', color: 'var(--earth-800)', fontWeight: '600', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Store size={13} color="var(--primary-700)" />
                        {item.farmName || 'Local Farm'}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '1.25rem' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-900)' }}>
                          ₹{item.pricePerUnit}
                        </span>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                          / {item.unit}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem' }}>
                        <Button
                          variant="primary"
                          size="sm"
                          fullWidth
                          disabled={isOutOfStock || isItemLoading}
                          onClick={() => handleAddToCartFromWishlist(item, true)}
                          icon={<ShoppingCart size={15} />}
                        >
                          {isOutOfStock ? 'Out of Stock' : 'Move to Cart'}
                        </Button>

                        <button
                          onClick={() => handleRemove(item.productId)}
                          disabled={isItemLoading}
                          style={{
                            padding: '0.4rem 0.65rem',
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Remove from wishlist"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <Link to={`/products/${item.productId}`} style={{ width: '100%', textDecoration: 'none' }}>
                        <Button variant="outline" size="sm" fullWidth icon={<Eye size={15} />}>
                          View Produce Details
                        </Button>
                      </Link>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default WishlistPage;
