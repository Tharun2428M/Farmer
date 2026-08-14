import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  SlidersHorizontal, 
  RotateCcw, 
  Check, 
  Search, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import SearchBar from '../../components/common/SearchBar';
import ProductGrid from '../../components/product/ProductGrid';
import Button from '../../components/common/Button';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../../utils/mockData';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category') || 'ALL';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  // Sync state if URL search parameters change
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    if (categoryParam) setSelectedCategory(categoryParam);
    if (searchParam !== null) setSearchQuery(searchParam);
  }, [searchParams]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      // 1. Category filter
      if (selectedCategory !== 'ALL' && product.categoryId !== selectedCategory) {
        return false;
      }
      // 2. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesFarmer = product.farmerName.toLowerCase().includes(q);
        const matchesCategory = product.categoryName.toLowerCase().includes(q);
        const matchesLocation = product.location.toLowerCase().includes(q);
        if (!matchesName && !matchesFarmer && !matchesCategory && !matchesLocation) {
          return false;
        }
      }
      // 3. Price filter
      if (product.price > maxPrice) {
        return false;
      }
      // 4. Organic filter
      if (organicOnly && !product.isOrganic) {
        return false;
      }
      // 5. In Stock filter
      if (inStockOnly && product.status !== 'IN_STOCK') {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.featured ? 1 : -1; // Default featured
    });
  }, [selectedCategory, searchQuery, sortBy, maxPrice, organicOnly, inStockOnly]);

  const handleResetFilters = () => {
    setSelectedCategory('ALL');
    setSearchQuery('');
    setSortBy('featured');
    setMaxPrice(1000);
    setOrganicOnly(false);
    setInStockOnly(false);
    setSearchParams({});
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'ALL') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const paginatedProducts = filteredProducts.slice(0, visibleCount);

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
            100% Direct Harvest
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            Fresh Farm Produce Catalog
          </h1>
          <p style={{ fontSize: '1rem', color: '#cbd5e1', maxWidth: '600px' }}>
            Explore verified local crops. Filter by category, organic certification, farmer origin, and price.
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
          marginBottom: '2rem'
        }}>
          {/* Search Bar */}
          <div style={{ flex: '1 1 320px', maxWidth: '500px' }}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search by vegetable, fruit, or farmer..."
            />
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--border-light)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontWeight: '600',
                fontSize: '0.875rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="featured">Featured Crops</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Category Horizontal Quick Filters */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '1rem',
          marginBottom: '1.75rem',
          scrollbarWidth: 'none'
        }}>
          <button
            onClick={() => handleCategorySelect('ALL')}
            className={`btn ${selectedCategory === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '0.4rem 1rem', fontSize: '0.8125rem' }}
          >
            All Produce ({MOCK_PRODUCTS.length})
          </button>
          {MOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`btn ${selectedCategory === cat.id ? 'btn-primary' : 'btn-outline'}`}
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '0.4rem 1rem',
                fontSize: '0.8125rem',
                whiteSpace: 'nowrap'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Main Content Layout: Sidebar Filters + Products Grid */}
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
                <SlidersHorizontal size={18} /> Filter Harvest
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

            {/* Price Slider */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Max Price</span>
                <span style={{ color: 'var(--primary-800)', fontWeight: '700' }}>₹{maxPrice}</span>
              </label>
              <input
                type="range"
                min="30"
                max="1000"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary-700)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>₹30</span>
                <span>₹1000</span>
              </div>
            </div>

            {/* Checkboxes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={organicOnly}
                  onChange={(e) => setOrganicOnly(e.target.checked)}
                  style={{ accentColor: 'var(--primary-700)', width: '16px', height: '16px' }}
                />
                <span>Certified Organic Only</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  style={{ accentColor: 'var(--primary-700)', width: '16px', height: '16px' }}
                />
                <span>In Stock & Ready Dispatch</span>
              </label>
            </div>
          </aside>

          {/* Right Product Grid */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem'
            }}>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)' }}>
                Showing <strong style={{ color: 'var(--primary-900)' }}>{paginatedProducts.length}</strong> of{' '}
                <strong style={{ color: 'var(--primary-900)' }}>{filteredProducts.length}</strong> agricultural items
              </p>
            </div>

            <ProductGrid
              products={paginatedProducts}
              emptyTitle="No matching produce found"
              emptyMessage="Try selecting a different category or resetting the price filter."
              onReset={handleResetFilters}
            />

            {/* Load More Button */}
            {visibleCount < filteredProducts.length && (
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setVisibleCount((prev) => prev + 4)}
                >
                  Load More Fresh Crops ({filteredProducts.length - visibleCount} remaining)
                </Button>
              </div>
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
