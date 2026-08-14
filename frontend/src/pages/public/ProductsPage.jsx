import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  SlidersHorizontal, 
  RotateCcw, 
  Search, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Package,
  Layers
} from 'lucide-react';
import productService from '../../services/productService';
import ProductCard from '../../components/product/ProductCard';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter state derived from URL or defaults
  const initialCategory = searchParams.get('categoryId') || 'ALL';
  const initialKeyword = searchParams.get('keyword') || '';
  const initialSort = searchParams.get('sort') || 'newest';
  const initialPage = parseInt(searchParams.get('page') || '0', 10);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [keywordInput, setKeywordInput] = useState(initialKeyword);
  const [activeKeyword, setActiveKeyword] = useState(initialKeyword);
  
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [appliedMinPrice, setAppliedMinPrice] = useState(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(null);

  const [sortBy, setSortBy] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize] = useState(12);

  // Products response state
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch Categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await productService.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // 2. Fetch Products with parameters
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');

    const params = {
      page: currentPage,
      size: pageSize,
      sort: sortBy
    };

    if (activeKeyword.trim()) {
      params.keyword = activeKeyword.trim();
    }
    if (selectedCategory !== 'ALL') {
      params.categoryId = Number(selectedCategory);
    }
    if (appliedMinPrice !== null && appliedMinPrice !== '') {
      params.minPrice = Number(appliedMinPrice);
    }
    if (appliedMaxPrice !== null && appliedMaxPrice !== '') {
      params.maxPrice = Number(appliedMaxPrice);
    }

    try {
      const data = await productService.getPublicProducts(params);
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(err.response?.data?.message || 'Could not load fresh farm produce. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, sortBy, activeKeyword, selectedCategory, appliedMinPrice, appliedMaxPrice]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveKeyword(keywordInput);
    setCurrentPage(0);
  };

  const handleClearSearch = () => {
    setKeywordInput('');
    setActiveKeyword('');
    setCurrentPage(0);
  };

  // Handle Category Selection
  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setCurrentPage(0);
  };

  // Handle Price Filter Apply
  const handleApplyPriceFilter = (e) => {
    e.preventDefault();
    setAppliedMinPrice(minPrice !== '' ? minPrice : null);
    setAppliedMaxPrice(maxPrice !== '' ? maxPrice : null);
    setCurrentPage(0);
  };

  // Handle Reset All Filters
  const handleResetFilters = () => {
    setSelectedCategory('ALL');
    setKeywordInput('');
    setActiveKeyword('');
    setMinPrice('');
    setMaxPrice('');
    setAppliedMinPrice(null);
    setAppliedMaxPrice(null);
    setSortBy('newest');
    setCurrentPage(0);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-app)', minHeight: '80vh', paddingBottom: '5rem' }}>
      
      {/* Page Banner */}
      <div style={{
        backgroundColor: 'var(--primary-900)',
        color: 'white',
        padding: '3rem 0',
        marginBottom: '2.5rem',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div className="container">
          <span style={{
            fontSize: '0.8125rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--primary-300)',
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            100% Direct From Local Soil
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            Fresh Produce Marketplace
          </h1>
          <p style={{ fontSize: '1rem', color: '#cbd5e1', maxWidth: '600px' }}>
            Discover seasonal vegetables, fresh orchard fruits, grains, and leafy greens harvested daily by local verified farmers.
          </p>
        </div>
      </div>

      <div className="container">

        {/* Top Controls Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.75rem'
        }}>
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} style={{ flex: '1 1 320px', maxWidth: '520px', display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="Search tomatoes, spinach, apples, or farm name..."
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem 0.65rem 2.6rem',
                  borderRadius: 'var(--radius-xl)',
                  border: '1.5px solid var(--border-light)',
                  backgroundColor: 'var(--bg-surface)',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
              {keywordInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontWeight: '700'
                  }}
                >
                  Clear
                </button>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ borderRadius: 'var(--radius-xl)', padding: '0 1.25rem', fontSize: '0.875rem', fontWeight: '700' }}
            >
              Search
            </button>
          </form>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(0);
              }}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-xl)',
                border: '1.5px solid var(--border-light)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontWeight: '600',
                fontSize: '0.875rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="newest">Newest Harvest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* Category Horizontal Quick Filter Pills */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.75rem',
          marginBottom: '1.75rem',
          scrollbarWidth: 'none'
        }}>
          <button
            onClick={() => handleCategorySelect('ALL')}
            className={`btn ${selectedCategory === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '0.4rem 1.1rem', fontSize: '0.8125rem' }}
          >
            All Crops
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(String(cat.id))}
              className={`btn ${selectedCategory === String(cat.id) ? 'btn-primary' : 'btn-outline'}`}
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '0.4rem 1.1rem',
                fontSize: '0.8125rem',
                whiteSpace: 'nowrap'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#fff1f2',
            border: '1px solid #fecdd3',
            color: '#be123c',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            fontSize: '0.875rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
            <button onClick={loadProducts} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
              <RefreshCw size={13} style={{ marginRight: '0.25rem' }} /> Retry
            </button>
          </div>
        )}

        {/* Main Layout: Sidebar Filters + Products Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem',
          alignItems: 'start'
        }} className="catalog-layout">
          
          {/* Left Filter Sidebar */}
          <aside className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-surface)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid var(--border-light)'
            }}>
              <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <SlidersHorizontal size={18} /> Filters
              </span>
              <button
                onClick={handleResetFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-700)',
                  fontSize: '0.8125rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <RotateCcw size={13} /> Reset
              </button>
            </div>

            {/* Price Range Filter Form */}
            <form onSubmit={handleApplyPriceFilter} style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>
                Price Range (₹)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="number"
                  min="0"
                  placeholder="Min (₹)"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    fontSize: '0.8125rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)'
                  }}
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Max (₹)"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    fontSize: '0.8125rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)'
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn btn-outline"
                style={{ width: '100%', padding: '0.4rem 0', fontSize: '0.8125rem', fontWeight: '700' }}
              >
                Apply Price
              </button>
            </form>

            {/* Active Filters Summary */}
            {(activeKeyword || selectedCategory !== 'ALL' || appliedMinPrice !== null || appliedMaxPrice !== null) && (
              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                  Active Criteria
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {activeKeyword && (
                    <span style={{ fontSize: '0.6875rem', padding: '0.2rem 0.5rem', backgroundColor: 'var(--primary-100)', color: 'var(--primary-900)', borderRadius: 'var(--radius-full)' }}>
                      Search: "{activeKeyword}"
                    </span>
                  )}
                  {selectedCategory !== 'ALL' && (
                    <span style={{ fontSize: '0.6875rem', padding: '0.2rem 0.5rem', backgroundColor: 'var(--primary-100)', color: 'var(--primary-900)', borderRadius: 'var(--radius-full)' }}>
                      Category: {categories.find(c => String(c.id) === selectedCategory)?.name || selectedCategory}
                    </span>
                  )}
                  {(appliedMinPrice !== null || appliedMaxPrice !== null) && (
                    <span style={{ fontSize: '0.6875rem', padding: '0.2rem 0.5rem', backgroundColor: 'var(--primary-100)', color: 'var(--primary-900)', borderRadius: 'var(--radius-full)' }}>
                      ₹{appliedMinPrice || 0} - ₹{appliedMaxPrice || '∞'}
                    </span>
                  )}
                </div>
              </div>
            )}
          </aside>

          {/* Right Product Grid */}
          <div>
            {/* Results Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem'
            }}>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)' }}>
                Showing <strong style={{ color: 'var(--primary-900)' }}>{products.length}</strong> of{' '}
                <strong style={{ color: 'var(--primary-900)' }}>{totalElements}</strong> available farm items
              </p>
            </div>

            {loading ? (
              <div style={{ padding: '5rem 0', display: 'flex', justifyContent: 'center' }}>
                <LoadingSpinner text="Harvesting marketplace produce..." size="lg" />
              </div>
            ) : products.length === 0 ? (
              <div style={{
                padding: '4rem 2rem',
                textAlign: 'center',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-2xl)',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: 'var(--primary-50)',
                  color: 'var(--primary-700)',
                  borderRadius: 'var(--radius-xl)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  <Package size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
                  No produce matching your criteria
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                  Try relaxing your price filters, selecting a different category, or clearing your search term.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="btn btn-primary"
                  style={{ padding: '0.65rem 1.5rem', fontSize: '0.875rem' }}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                {/* Product Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginTop: '3rem'
                  }}>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      disabled={currentPage === 0}
                      className="btn btn-outline"
                      style={{ padding: '0.5rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <ChevronLeft size={16} /> Previous
                    </button>

                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`btn ${currentPage === i ? 'btn-primary' : 'btn-outline'}`}
                          style={{
                            minWidth: '36px',
                            height: '36px',
                            padding: '0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '0.8125rem'
                          }}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                      disabled={currentPage >= totalPages - 1}
                      className="btn btn-outline"
                      style={{ padding: '0.5rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}

          </div>

        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .catalog-layout {
            grid-template-columns: 260px 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductsPage;
