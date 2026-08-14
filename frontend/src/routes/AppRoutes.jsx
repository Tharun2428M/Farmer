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
import FarmerDashboard from '../pages/farmer/FarmerDashboard';
import FarmerProductList from '../pages/farmer/FarmerProductList';
import AddProductPage from '../pages/farmer/AddProductPage';
import EditProductPage from '../pages/farmer/EditProductPage';
import FarmerProfilePage from '../pages/farmer/FarmerProfilePage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ProtectedRoute from '../components/common/ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
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

        {/* Admin Protected Routes (ADMIN role only) */}
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Navigate to="/admin/dashboard" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
