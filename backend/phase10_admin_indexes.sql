-- =====================================================================================
-- LOCAL FARMERS MARKETPLACE — PHASE 10 DATABASE PERFORMANCE & INDEXING OPTIMIZATION
-- =====================================================================================
-- Target Database: Supabase PostgreSQL
-- Purpose: Accelerate query speeds for administrative dashboards, analytical time-series,
--          user moderation, inventory threshold scans, and full-text search.
-- Enable pg_trgm extension for trigram search and GIN indexes
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table Indexes
CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role, status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- 2. Farmer Profiles Table Indexes
CREATE INDEX IF NOT EXISTS idx_farmer_profiles_farm_name ON farmer_profiles(farm_name);
CREATE INDEX IF NOT EXISTS idx_farmer_profiles_rating ON farmer_profiles(rating DESC);

-- 3. Categories Table Indexes
CREATE INDEX IF NOT EXISTS idx_categories_name_lower ON categories(LOWER(name));

-- 4. Products Table Indexes
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_farmer_id ON products(farmer_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_title_trgm ON products USING gin(title gin_trgm_ops);

-- 5. Inventory Table Indexes (for quick low-stock detection)
CREATE INDEX IF NOT EXISTS idx_inventory_stock_threshold ON inventory(stock_quantity, low_stock_threshold);
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory(product_id);

-- 6. Orders Table Indexes (for revenue aggregation & status filtering)
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status_created_at ON orders(status, created_at DESC);

-- 7. Order Items Table Indexes (for top-selling produce & farmer sales rank)
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_farmer_id ON order_items(farmer_id);

-- 8. Payments Table Indexes (for audit ledger & transaction lookups)
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_method ON payments(payment_method);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(transaction_reference);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- 9. Deliveries Table Indexes (for dispatch monitoring)
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries(status);
CREATE INDEX IF NOT EXISTS idx_deliveries_driver ON deliveries(delivery_person_name);
CREATE INDEX IF NOT EXISTS idx_deliveries_created_at ON deliveries(created_at DESC);

-- 10. Reviews Table Indexes (for moderation & product score computations)
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- 11. Notifications Table Indexes (for instant badge counts & user feed)
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Analyze database statistics for optimal query planner paths
ANALYZE users;
ANALYZE farmer_profiles;
ANALYZE customer_profiles;
ANALYZE categories;
ANALYZE products;
ANALYZE inventory;
ANALYZE orders;
ANALYZE order_items;
ANALYZE payments;
ANALYZE deliveries;
ANALYZE reviews;
ANALYZE notifications;
