import React from 'react';
import ProductCard from './ProductCard';
import EmptyState from '../common/EmptyState';

export const ProductGrid = ({ products = [], emptyTitle, emptyMessage, onReset }) => {
  if (!products || products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || 'No farm products found'}
        message={emptyMessage || 'Try adjusting your search criteria or browse all fresh categories.'}
        actionLabel={onReset ? 'Clear Filters' : undefined}
        onAction={onReset}
      />
    );
  }

  return (
    <div className="grid-products">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
