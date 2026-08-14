import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Carrot, 
  Apple, 
  Wheat, 
  Sprout, 
  Milk, 
  Layers, 
  Flower2, 
  Flame, 
  ArrowRight 
} from 'lucide-react';

const iconMap = {
  Carrot: Carrot,
  Apple: Apple,
  Wheat: Wheat,
  Sprout: Sprout,
  Milk: Milk,
  Layers: Layers,
  Flower2: Flower2,
  Flame: Flame
};

export const CategoryCard = ({ category }) => {
  if (!category) return null;
  const IconComponent = iconMap[category.icon] || Sprout;

  return (
    <Link
      to={`/products?category=${category.id}`}
      className="card category-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '1.75rem 1.25rem',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--bg-surface)',
        transition: 'all var(--transition-normal)'
      }}
    >
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: category.bgLight || 'var(--primary-100)',
        color: category.accentColor || 'var(--primary-800)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
        transition: 'transform var(--transition-fast)'
      }} className="category-icon-wrapper">
        <IconComponent size={30} />
      </div>

      <h3 style={{
        fontSize: '1.0625rem',
        fontWeight: '700',
        color: 'var(--primary-900)',
        marginBottom: '0.35rem'
      }}>
        {category.name}
      </h3>

      <span style={{
        fontSize: '0.8125rem',
        color: 'var(--text-muted)',
        fontWeight: '500'
      }}>
        {category.itemCount}+ Varieties
      </span>

      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        fontSize: '0.75rem',
        fontWeight: '700',
        color: 'var(--primary-700)',
        marginTop: '0.85rem'
      }} className="category-explore-link">
        Explore <ArrowRight size={13} />
      </div>

      <style>{`
        .category-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary-500);
          box-shadow: var(--shadow-md);
        }
        .category-card:hover .category-icon-wrapper {
          transform: scale(1.1);
        }
      `}</style>
    </Link>
  );
};

export default CategoryCard;
