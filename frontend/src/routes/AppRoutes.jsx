import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Home from '../pages/public/Home';
import ProductsPage from '../pages/public/ProductsPage';
import ProductDetailsPage from '../pages/public/ProductDetailsPage';
import CategoriesPage from '../pages/public/CategoriesPage';
import AboutPage from '../pages/public/AboutPage';
import ContactPage from '../pages/public/ContactPage';
import NotFoundPage from '../pages/public/NotFoundPage';
import UnauthorizedPage from '../pages/public/UnauthorizedPage';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import CartPage from '../pages/customer/CartPage';
import WishlistPage from '../pages/customer/WishlistPage';
import CheckoutPage from '../pages/customer/CheckoutPage';
import OrderSuccessPage from '../pages/customer/OrderSuccessPage';
import CustomerOrdersPage from '../pages/customer/CustomerOrdersPage';
import CustomerOrderDetailPage from '../pages/customer/CustomerOrderDetailPage';
import FarmerDashboard from '../pages/farmer/FarmerDashboard';
import FarmerProductList from '../pages/farmer/FarmerProductList';
import AddProductPage from '../pages/farmer/AddProductPage';
import EditProductPage from '../pages/farmer/EditProductPage';
import FarmerProfilePage from '../pages/farmer/FarmerProfilePage';
import FarmerOrdersPage from '../pages/farmer/FarmerOrdersPage';
import NotificationsPage from '../pages/customer/NotificationsPage';

// Admin Components & Pages
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminFarmersPage from '../pages/admin/AdminFarmersPage';
import AdminProductsPage from '../pages/admin/AdminProductsPage';
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminPaymentsPage from '../pages/admin/AdminPaymentsPage';
import AdminDeliveriesPage from '../pages/admin/AdminDeliveriesPage';
import AdminReviewsPage from '../pages/admin/AdminReviewsPage';
import AdminAnalyticsPage from '../pages/admin/AdminAnalyticsPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';
import AdminLowStockPage from '../pages/admin/AdminLowStockPage';
import AdminSystemHealthPage from '../pages/admin/AdminSystemHealthPage';

import ProtectedRoute from '../components/common/ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Main Public & Customer/Farmer Storefront Route Tree */}
      <Route path="/" element={<MainLayout />}>
        {/* Public Catalog & Marketing Routes */}
        <Route index element={<Home />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />

        {/* Authentication Routes */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        {/* Authenticated Notifications Route (Available for all logged-in roles) */}
        <Route
          path="notifications"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'FARMER', 'ADMIN']}>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        {/* Customer Protected Routes (CUSTOMER role only) */}
        <Route
          path="customer"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <Navigate to="/customer/dashboard" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="customer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="customer/cart"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="customer/wishlist"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <WishlistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="customer/checkout"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="customer/order-success/:id"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <OrderSuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="customer/orders"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <CustomerOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="customer/orders/:id"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <CustomerOrderDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Farmer Protected Routes (FARMER role only) */}
        <Route
          path="farmer"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="farmer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="farmer/products"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <FarmerProductList />
            </ProtectedRoute>
          }
        />
        <Route
          path="farmer/products/add"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <AddProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="farmer/products/edit/:id"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <EditProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="farmer/profile"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <FarmerProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="farmer/orders"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <FarmerOrdersPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Catch-All within MainLayout */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Module Routes — Dedicated AdminLayout and Protected with ADMIN role */}
      <Route
        path="admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<Navigate to="/admin" replace />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="farmers" element={<AdminFarmersPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="payments" element={<AdminPaymentsPage />} />
        <Route path="deliveries" element={<AdminDeliveriesPage />} />
        <Route path="reviews" element={<AdminReviewsPage />} />
        <Route path="low-stock" element={<AdminLowStockPage />} />
        <Route path="system" element={<AdminSystemHealthPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
