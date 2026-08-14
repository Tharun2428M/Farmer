import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash2, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Store, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  Truck,
  ArrowRight,
  Info
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const CartPage = () => {
  const { cart, totalQuantity, totalAmount, updateQuantity, removeFromCart, clearCart, loading } = useCart();
  const [updatingId, setUpdatingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const items = cart?.items || [];

  const handleQuantityChange = async (item, newQuantity) => {
    setErrorMessage('');
    if (newQuantity < 1) return;
    if (item.stockQuantity !== undefined && newQuantity > item.stockQuantity) {
      setErrorMessage(`Only ${item.stockQuantity} ${item.unit} available for ${item.title}.`);
      return;
    }
    setUpdatingId(item.id);
    try {
      await updateQuantity(item.id, newQuantity);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to update item quantity.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    setErrorMessage('');
    setUpdatingId(itemId);
    try {
      await removeFromCart(itemId);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to remove item.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your entire harvest cart?')) {
      setErrorMessage('');
      try {
        await clearCart();
      } catch (err) {
        setErrorMessage(err.response?.data?.message || 'Failed to clear cart.');
      }
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-app)', minHeight: '80vh', paddingBottom: '6rem' }}>
      
      {/* Page Header */}
      <div style={{
        backgroundColor: 'var(--primary-900)',
        color: 'white',
        padding: '2.5rem 0',
        marginBottom: '2rem'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-300)', fontSize: '0.8125rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              <ShoppingCart size={16} /> Direct Harvest Cart
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Your Shopping Cart</h1>
          </div>
          <Link to="/products">
            <Button variant="outline" size="sm" icon={<ArrowLeft size={16} />} style={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.4)' }}>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>

      <div className="container">

        {/* Global Error Banner */}
        {errorMessage && (
          <div style={{
            padding: '1rem 1.25rem',
            backgroundColor: '#fff1f2',
            border: '1px solid #fecdd3',
            color: '#be123c',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.875rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {items.length === 0 ? (
          /* Empty Cart State */
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
              backgroundColor: 'var(--primary-50)',
              color: 'var(--primary-700)',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <ShoppingCart size={40} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
              Your cart is currently empty
            </h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.75rem' }}>
              Explore seasonal farm harvests directly from local growers and add chemical-free produce to your cart.
            </p>
            <Link to="/products">
              <Button variant="primary" size="lg" icon={<Sparkles size={18} />}>
                Explore Fresh Crops
              </Button>
            </Link>
          </div>
        ) : (
          /* Cart with Items Layout */
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2rem',
            alignItems: 'start'
          }} className="cart-grid-layout">
            
            {/* Left Column: Items List */}
            <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-2xl)' }}>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--border-light)',
                marginBottom: '1rem'
              }}>
                <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary-900)' }}>
                  Produce Items ({totalQuantity})
                </span>
                <button
                  onClick={handleClearCart}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#e11d48',
                    fontSize: '0.8125rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <Trash2 size={14} /> Clear Cart
                </button>
              </div>

              {/* Items Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '80px 1fr auto',
                      gap: '1.25rem',
                      alignItems: 'center',
                      padding: '1rem',
                      borderRadius: 'var(--radius-xl)',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                      opacity: updatingId === item.id ? 0.6 : 1,
                      transition: 'opacity 0.2s'
                    }}
                    className="cart-item-row"
                  >
                    {/* Produce Image */}
                    <Link to={`/products/${item.productId}`} style={{ display: 'block', width: '80px', height: '80px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=60'}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=60';
                        }}
                      />
                    </Link>

                    {/* Produce Details & Farm */}
                    <div>
                      <Link to={`/products/${item.productId}`} style={{ textDecoration: 'none' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.2rem' }}>
                          {item.title}
                        </h3>
                      </Link>
                      <p style={{ fontSize: '0.75rem', color: 'var(--earth-800)', fontWeight: '600', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Store size={12} color="var(--primary-700)" />
                        {item.farmName || 'Local Farm'}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--primary-800)' }}>
                          ₹{item.pricePerUnit}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          / {item.unit}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Controls & Subtotal */}
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      {/* Subtotal */}
                      <span style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--primary-900)' }}>
                        ₹{item.subtotal}
                      </span>

                      {/* Controls Row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid var(--border-light)',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-surface)',
                          overflow: 'hidden'
                        }}>
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updatingId === item.id}
                            style={{
                              width: '28px',
                              height: '28px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--primary-900)'
                            }}
                          >
                            <Minus size={13} />
                          </button>
                          <span style={{ width: '32px', textAlign: 'center', fontSize: '0.8125rem', fontWeight: '700' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            disabled={item.quantity >= item.stockQuantity || updatingId === item.id}
                            style={{
                              width: '28px',
                              height: '28px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              cursor: item.quantity >= item.stockQuantity ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--primary-900)'
                            }}
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        {/* Trash Button */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={updatingId === item.id}
                          style={{
                            width: '28px',
                            height: '28px',
                            border: 'none',
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Remove item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>

            {/* Right Column: Order Summary Card */}
            <div style={{ position: 'sticky', top: '2rem' }}>
              <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border-light)' }}>
                
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-900)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
                  Order Summary
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem', fontSize: '0.9375rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Total Produce Items:</span>
                    <strong style={{ color: 'var(--primary-900)' }}>{totalQuantity} items</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Harvest Subtotal:</span>
                    <strong style={{ color: 'var(--primary-900)' }}>₹{totalAmount}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Middleman Commission:</span>
                    <strong style={{ color: '#15803d' }}>₹0.00 (Zero Commission)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Estimated Farm Delivery:</span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-light)' }}>Calculated in Phase 10</span>
                  </div>
                </div>

                <div style={{
                  paddingTop: '1rem',
                  borderTop: '2px dashed var(--border-light)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline'
                }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-900)' }}>Total Amount:</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary-900)' }}>₹{totalAmount}</span>
                </div>

                {/* Checkout Button */}
                <div style={{ marginBottom: '1rem' }}>
                  <Link
                    to="/customer/checkout"
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.25rem',
                      borderRadius: 'var(--radius-xl)',
                      backgroundColor: 'var(--primary-800)',
                      color: 'white',
                      border: 'none',
                      fontWeight: '700',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none',
                      boxShadow: '0 4px 12px rgba(45, 106, 79, 0.25)',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    Proceed to Direct Checkout <ArrowRight size={18} />
                  </Link>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.65rem', fontSize: '0.75rem', color: 'var(--text-muted)', justifyContent: 'center' }}>
                    <ShieldCheck size={14} color="var(--primary-700)" />
                    <span>Direct-from-farmer delivery & zero middleman commission</span>
                  </div>
                </div>

                {/* Guarantees */}
                <div style={{
                  padding: '0.85rem',
                  backgroundColor: 'var(--primary-50)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--primary-900)',
                  fontWeight: '600'
                }}>
                  <ShieldCheck size={16} color="var(--primary-700)" style={{ flexShrink: 0 }} />
                  <span>100% Guaranteed farm gate direct revenue to local growers</span>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>

      <style>{`
        @media (min-width: 900px) {
          .cart-grid-layout {
            grid-template-columns: 1fr 360px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CartPage;
