import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Button Component
 * Props:
 * - variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'danger'
 * - size: 'sm' | 'md' | 'lg'
 * - fullWidth: boolean
 * - loading: boolean
 * - icon: ReactNode
 * - iconPosition: 'left' | 'right'
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const variantClass = `btn-${variant}`;
  const widthClass = fullWidth ? 'btn-full' : '';

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${widthClass} ${className}`.trim()}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />}
      {!loading && icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
      {children}
      {!loading && icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
    </button>
  );
};

export default Button;
