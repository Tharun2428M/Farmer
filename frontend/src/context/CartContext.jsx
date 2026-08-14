import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import cartService from '../services/cartService';
import wishlistService from '../services/wishlistService';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const isCustomer = isAuthenticated && user?.role === 'CUSTOMER';

  const [cart, setCart] = useState({ items: [], totalQuantity: 0, totalAmount: 0 });
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Refresh Cart from backend
  const refreshCart = useCallback(async () => {
    if (!isCustomer) {
      setCart({ items: [], totalQuantity: 0, totalAmount: 0 });
      return;
    }
    try {
      const data = await cartService.getCart();
      setCart(data || { items: [], totalQuantity: 0, totalAmount: 0 });
    } catch (err) {
      console.error('Failed to load cart:', err);
    }
  }, [isCustomer]);

  // Refresh Wishlist from backend
  const refreshWishlist = useCallback(async () => {
    if (!isCustomer) {
      setWishlist([]);
      return;
    }
    try {
      const data = await wishlistService.getWishlist();
      setWishlist(data || []);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    }
  }, [isCustomer]);

  // Auto-sync when customer authenticates or switches
  useEffect(() => {
    if (isCustomer) {
      refreshCart();
      refreshWishlist();
    } else {
      setCart({ items: [], totalQuantity: 0, totalAmount: 0 });
      setWishlist([]);
    }
  }, [isCustomer, refreshCart, refreshWishlist]);

  // Cart operations
  const addToCart = async (productId, quantity = 1) => {
    if (!isCustomer) {
      throw new Error('Please login with a Customer account to add produce to your cart.');
    }
    setLoading(true);
    try {
      const updatedCart = await cartService.addToCart({ productId, quantity });
      setCart(updatedCart);
      return updatedCart;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (!isCustomer) return;
    setLoading(true);
    try {
      const updatedCart = await cartService.updateCartItemQuantity(cartItemId, quantity);
      setCart(updatedCart);
      return updatedCart;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!isCustomer) return;
    setLoading(true);
    try {
      const updatedCart = await cartService.removeCartItem(cartItemId);
      setCart(updatedCart);
      return updatedCart;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isCustomer) return;
    setLoading(true);
    try {
      const updatedCart = await cartService.clearCart();
      setCart(updatedCart);
      return updatedCart;
    } finally {
      setLoading(false);
    }
  };

  // Wishlist operations
  const addToWishlist = async (productId) => {
    if (!isCustomer) {
      throw new Error('Please login with a Customer account to save produce to your wishlist.');
    }
    const updatedWishlist = await wishlistService.addToWishlist(productId);
    setWishlist(updatedWishlist);
    return updatedWishlist;
  };

  const removeFromWishlist = async (productId) => {
    if (!isCustomer) return;
    const updatedWishlist = await wishlistService.removeFromWishlist(productId);
    setWishlist(updatedWishlist);
    return updatedWishlist;
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.productId === productId);
  };

  const value = {
    cart,
    wishlist,
    totalQuantity: cart?.totalQuantity || 0,
    totalAmount: cart?.totalAmount || 0,
    wishlistCount: wishlist?.length || 0,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshCart,
    refreshWishlist
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
