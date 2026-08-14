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
  Check,
  LogIn,
  Star,
  MessageSquarePlus,
  Loader2
} from 'lucide-react';
import productService from '../../services/productService';
import reviewService from '../../services/reviewService';
import useAuth from '../../hooks/useAuth';
import { useCart } from '../../context/CartContext';
import Rating from '../../components/common/Rating';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  const [cartSuccess, setCartSuccess] = useState(false);
  const [actionError, setActionError] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const isCustomer = isAuthenticated && user?.role === 'CUSTOMER';
  const wishlisted = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await productService.getPublicProductById(id);
        setProduct(data);
        loadReviews(id);
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
      fetchProductAndReviews();
    }
  }, [id]);

  const loadReviews = async (productId) => {
    try {
      setReviewsLoading(true);
      const revList = await reviewService.getProductReviews(productId);
      setReviews(revList);
    } catch (err) {
      console.error('Failed to load product reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setActionError('');
    setCartSuccess(false);

    if (!isAuthenticated) {
      setActionError('Please login to add fresh farm produce to your cart.');
      return;
    }
    if (user?.role !== 'CUSTOMER') {
      setActionError('Only customer accounts can purchase crops. Please log in with a customer account.');
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(product.id, quantity);
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 4000);
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to add to cart.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleWishlist = async () => {
    setActionError('');

    if (!isAuthenticated) {
      setActionError('Please login to save produce to your wishlist.');
      return;
    }
    if (user?.role !== 'CUSTOMER') {
      setActionError('Only customer accounts can save to wishlist.');
      return;
    }

    try {
      if (wishlisted) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product.id);
      }
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to update wishlist.');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setReviewError('Please log in to review this crop.');
      return;
    }
    if (user?.role !== 'CUSTOMER') {
      setReviewError('Only customers with delivered orders can submit a review.');
      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewError('');
      setReviewSuccess('');

      await reviewService.createReview(product.id, {
        rating: newRating,
        comment: newComment
      });

      setReviewSuccess('Thank you! Your verified farm review was published.');
      setNewComment('');
      setNewRating(5);
      await loadReviews(product.id);
    } catch (err) {
      console.error('Failed to submit review:', err);
      const msg = err.response?.data?.message || 'Only verified purchasers with a delivered order can submit a review.';
      setReviewError(msg);
    } finally {
      setReviewSubmitting(false);
    }
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

  // Compute live rating from reviews if available, otherwise use default
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : (farmer.rating ? Number(farmer.rating) : 5.0);

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
                <Rating value={avgRating} count={reviews.length} size={18} />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  ({avgRating.toFixed(1)} / 5 • {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
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
              {/* Feedback Alerts */}
              {cartSuccess && (
                <div style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#dcfce7',
                  border: '1px solid #bbf7d0',
                  borderRadius: 'var(--radius-lg)',
                  color: '#166534',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Check size={16} />
                    <span>Added {quantity} {product.unit} of "{product.title}" to your cart!</span>
                  </div>
                  <Link to="/customer/cart" style={{ color: '#166534', textDecoration: 'underline', fontWeight: '700' }}>
                    View Cart
                  </Link>
                </div>
              )}

              {actionError && (
                <div style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#fff1f2',
                  border: '1px solid #fecdd3',
                  borderRadius: 'var(--radius-lg)',
                  color: '#be123c',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={16} />
                    <span>{actionError}</span>
                  </div>
                  {!isAuthenticated && (
                    <Link to="/login" style={{ color: '#be123c', textDecoration: 'underline', fontWeight: '700' }}>
                      Login Now
                    </Link>
                  )}
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
                  disabled={isOutOfStock || isAdding}
                  onClick={handleAddToCart}
                  icon={cartSuccess ? <Check size={20} /> : <ShoppingCart size={20} />}
                  style={{ flex: '1 1 220px', backgroundColor: cartSuccess ? '#15803d' : 'var(--primary-800)', opacity: isOutOfStock ? 0.6 : 1 }}
                >
                  {isOutOfStock ? 'Currently Out of Stock' : isAdding ? 'Adding to Cart...' : 'Add to Cart'}
                </Button>

                <Button
                  variant={wishlisted ? 'primary' : 'outline'}
                  size="lg"
                  onClick={handleToggleWishlist}
                  icon={<Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />}
                  style={{ borderColor: wishlisted ? 'var(--primary-800)' : 'var(--border-light)' }}
                >
                  {wishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
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

        {/* 3. CUSTOMER RATINGS & REVIEWS SECTION */}
        <div className="card" style={{
          padding: '2.5rem',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-2xl)',
          border: '1px solid var(--border-light)'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--border-light)'
          }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-900)' }}>
                Customer Ratings & Verified Reviews
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Direct consumer feedback verified upon delivered farm orders
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-900)' }}>
                  {avgRating.toFixed(1)}
                </span>
                <Rating value={avgRating} showNumeric={false} size={18} />
              </div>
            </div>
          </div>

          {/* Write a Review Section (For Customers) */}
          <div className="bg-emerald-50/40 rounded-2xl p-6 border border-emerald-100 mb-8">
            <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
              <MessageSquarePlus className="w-5 h-5 text-emerald-600" />
              Write a Verified Customer Review
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Share your feedback on the freshness, taste, and quality of this harvest. (Requires delivered purchase)
            </p>

            {reviewSuccess && (
              <div className="mb-4 p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{reviewSuccess}</span>
              </div>
            )}

            {reviewError && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{reviewError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Your Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gray-600 ml-2">{newRating} Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Your Review / Experience
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="How was the produce quality, aroma, taste, and packaging?"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2"
              >
                {reviewSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Submit Verified Review
              </button>
            </form>
          </div>

          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
              <p className="text-xs text-gray-500">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-8 bg-gray-50 rounded-xl text-center">
              <p className="text-sm text-gray-500">
                No customer reviews yet for this harvest. Be the first verified customer to leave a review!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl border border-gray-100 bg-white shadow-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                        {rev.customerName?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-900">{rev.customerName}</span>
                        <span className="ml-2 text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                          Verified Buyer
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(rev.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 mt-1">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
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
