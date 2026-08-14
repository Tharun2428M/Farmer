import React from 'react';
import { MOCK_CATEGORIES } from '../../utils/mockData';
import CategoryCard from '../../components/category/CategoryCard';

export const CategoriesPage = () => {
  return (
    <div style={{ backgroundColor: 'var(--bg-app)', paddingBottom: '6rem' }}>
      
      {/* Header Banner */}
      <div style={{
        backgroundColor: 'var(--primary-900)',
        color: 'white',
        padding: '3.5rem 0',
        marginBottom: '3rem',
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
            Harvest Directory
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            All Agricultural Categories
          </h1>
          <p style={{ fontSize: '1.0625rem', color: '#cbd5e1', maxWidth: '650px' }}>
            Discover the richness of local soil across certified organic vegetables, sweet seasonal fruits, ancient grains, and direct farm dairy.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="grid-categories">
          {MOCK_CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
