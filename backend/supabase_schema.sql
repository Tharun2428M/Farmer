-- ====================================================================
-- LOCAL FARMERS PRODUCE DIRECT-SELLING MARKETPLACE
-- SUPABASE POSTGRESQL COMPLETE DATABASE SCHEMA & SEED DATA (PHASE 2)
-- Execute this script in Supabase Dashboard -> SQL Editor
-- ====================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clean existing schema if starting fresh
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_timestamp() CASCADE;

DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.wishlist CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.deliveries CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.cart_items CASCADE;
DROP TABLE IF EXISTS public.carts CASCADE;
DROP TABLE IF EXISTS public.inventory CASCADE;
DROP TABLE IF EXISTS public.product_images CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.customer_profiles CASCADE;
DROP TABLE IF EXISTS public.farmer_profiles CASCADE;
DROP TABLE IF EXISTS public.addresses CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- --------------------------------------------------------------------
-- 1. BASE TABLES (No Foreign Keys pointing to other app tables)
-- --------------------------------------------------------------------

-- Base app users (Spring Boot JWT Auth)
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('CUSTOMER', 'FARMER', 'ADMIN')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Categories of agricultural products
CREATE TABLE public.categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- --------------------------------------------------------------------
-- 2. DEPENDENT LEVEL 1 TABLES
-- --------------------------------------------------------------------

-- User addresses
CREATE TABLE public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'India' NOT NULL,
    is_default BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Farmer Profile referencing Base User
CREATE TABLE public.farmer_profiles (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    farm_name VARCHAR(255) UNIQUE NOT NULL,
    farm_description TEXT,
    farm_address TEXT NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- --------------------------------------------------------------------
-- 3. DEPENDENT LEVEL 2 TABLES
-- --------------------------------------------------------------------

-- Customer Profile referencing Base User and default Address
CREATE TABLE public.customer_profiles (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    default_address_id UUID REFERENCES public.addresses(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Products listed by Farmers
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES public.farmer_profiles(id) ON DELETE CASCADE NOT NULL,
    category_id BIGINT REFERENCES public.categories(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price_per_unit NUMERIC(10, 2) NOT NULL CHECK (price_per_unit >= 0),
    unit VARCHAR(50) NOT NULL, -- e.g. 'kg', 'bundle', 'litre', 'dozen'
    image_url TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- --------------------------------------------------------------------
-- 4. DEPENDENT LEVEL 3 TABLES (Inventory, Carts, Orders, Reviews)
-- --------------------------------------------------------------------

-- Product images for gallery view
CREATE TABLE public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inventory tracking for products
CREATE TABLE public.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE UNIQUE NOT NULL,
    stock_quantity INTEGER NOT NULL CHECK (stock_quantity >= 0) DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5 NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Shopping carts for customer accounts
CREATE TABLE public.carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customer_profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Shopping cart line items
CREATE TABLE public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID REFERENCES public.carts(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0) DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_cart_product UNIQUE (cart_id, product_id)
);

-- Customer orders
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customer_profiles(id) ON DELETE RESTRICT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(50) DEFAULT 'PENDING' NOT NULL CHECK (status IN ('PENDING', 'CONFIRMED', 'PROCESSING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED')),
    payment_status VARCHAR(50) DEFAULT 'PENDING' NOT NULL CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    delivery_address_id UUID REFERENCES public.addresses(id) ON DELETE RESTRICT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Order individual line items
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    farmer_id UUID REFERENCES public.farmer_profiles(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_per_unit NUMERIC(10, 2) NOT NULL CHECK (price_per_unit >= 0),
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Payments for placed orders
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE RESTRICT UNIQUE NOT NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('CASH_ON_DELIVERY', 'ONLINE_CARD', 'UPI')),
    status VARCHAR(50) DEFAULT 'PENDING' NOT NULL CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED')),
    transaction_reference VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Delivery dispatch records
CREATE TABLE public.deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE RESTRICT UNIQUE NOT NULL,
    delivery_person_name VARCHAR(255),
    delivery_person_phone VARCHAR(20),
    status VARCHAR(50) DEFAULT 'PENDING' NOT NULL CHECK (status IN ('PENDING', 'ASSIGNED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED')),
    estimated_delivery_time TIMESTAMP WITH TIME ZONE,
    actual_delivery_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Customer reviews of products
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES public.customer_profiles(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_customer_product_review UNIQUE (product_id, customer_id)
);

-- Customer wishlists
CREATE TABLE public.wishlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customer_profiles(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_customer_product_wishlist UNIQUE (customer_id, product_id)
);

-- Notification center
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    type VARCHAR(50) DEFAULT 'GENERAL' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- --------------------------------------------------------------------
-- 5. PERFORMANCE INDEXES
-- --------------------------------------------------------------------

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_products_title ON public.products(title);
CREATE INDEX idx_products_farmer ON public.products(farmer_id);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_orders_customer ON public.orders(customer_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created ON public.orders(created_at);
CREATE INDEX idx_reviews_product ON public.reviews(product_id);


-- --------------------------------------------------------------------
-- 6. TIMESTAMP AUTOMATION TRIGGERS
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_users_timestamp BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER trg_update_addresses_timestamp BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER trg_update_farmer_profiles_timestamp BEFORE UPDATE ON public.farmer_profiles FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER trg_update_customer_profiles_timestamp BEFORE UPDATE ON public.customer_profiles FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER trg_update_products_timestamp BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER trg_update_inventory_timestamp BEFORE UPDATE ON public.inventory FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER trg_update_carts_timestamp BEFORE UPDATE ON public.carts FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER trg_update_cart_items_timestamp BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER trg_update_orders_timestamp BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER trg_update_payments_timestamp BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER trg_update_deliveries_timestamp BEFORE UPDATE ON public.deliveries FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER trg_update_reviews_timestamp BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


-- --------------------------------------------------------------------
-- 7. AUTO-CREATE PROFILE ON SUPABASE AUTH SIGNUP TRIGGER
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into our public.users table
  INSERT INTO public.users (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role'), 'CUSTOMER')
  );

  -- Create role-specific profiles automatically
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'CUSTOMER') = 'FARMER' THEN
    INSERT INTO public.farmer_profiles (id, farm_name, farm_address)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'farm_name', 'Unnamed Valley Farm'),
      COALESCE(NEW.raw_user_meta_data->>'farm_address', 'Provide Farm Address')
    );
  ELSE
    INSERT INTO public.customer_profiles (id, full_name)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1))
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger firing after user creation in Supabase Auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- --------------------------------------------------------------------
-- 8. REALISTIC SEED DATA (PHASE 2 - CLEARLY IDENTIFIABLE)
-- --------------------------------------------------------------------

-- Seed Categories
INSERT INTO public.categories (id, name, description, icon_name) VALUES
(1, 'Fresh Vegetables', 'Locally grown organic crops and greens', 'Carrot'),
(2, 'Organic Fruits', 'Fresh seasonal orchard fruits', 'Apple'),
(3, 'Dairy & Eggs', 'Milk, butter, cheeses & free-range eggs', 'Milk'),
(4, 'Honey & Preserves', 'Raw unfiltered honeys and fruit spreads', 'Flower2'),
(5, 'Grains & Pulses', 'Organic millets, rice, and farm wheats', 'Wheat')
ON CONFLICT (id) DO NOTHING;

-- Seed Mock Auth Users (For testing database connections without web UI signup)
-- These inserts populate public.users and profiles via triggers
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
VALUES
('f0000000-0000-0000-0000-000000000001', 'farmer.ramesh@farmersmarket.local', 'mock_encrypted_password', now(), '{"provider":"email","providers":["email"]}', '{"role":"FARMER","full_name":"Ramesh Patil","farm_name":"Patil Organic Farm","farm_address":"Agri Zone Sector 3, Pune"}', 'authenticated', 'authenticated'),
('f0000000-0000-0000-0000-000000000002', 'farmer.suresh@farmersmarket.local', 'mock_encrypted_password', now(), '{"provider":"email","providers":["email"]}', '{"role":"FARMER","full_name":"Suresh Kumar","farm_name":"Suresh Fresh Produce","farm_address":"Village Farm Outlet, Nashik"}', 'authenticated', 'authenticated'),
('c0000000-0000-0000-0000-000000000001', 'customer.anil@farmersmarket.local', 'mock_encrypted_password', now(), '{"provider":"email","providers":["email"]}', '{"role":"CUSTOMER","full_name":"Anil Sharma"}', 'authenticated', 'authenticated'),
('c0000000-0000-0000-0000-000000000002', 'customer.priya@farmersmarket.local', 'mock_encrypted_password', now(), '{"provider":"email","providers":["email"]}', '{"role":"CUSTOMER","full_name":"Priya Nair"}', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Addresses
INSERT INTO public.addresses (id, user_id, address_line1, address_line2, city, state, postal_code, is_default) VALUES
('e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Flat 402, Shivajinagar', 'Near Town Hall', 'Pune', 'Maharashtra', '411005', true),
('e0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'Row House 12, Indiranagar', 'Agri Circle', 'Nashik', 'Maharashtra', '422009', true)
ON CONFLICT (id) DO NOTHING;

-- Link default address to customer profiles
UPDATE public.customer_profiles SET default_address_id = 'e0000000-0000-0000-0000-000000000001' WHERE id = 'c0000000-0000-0000-0000-000000000001';
UPDATE public.customer_profiles SET default_address_id = 'e0000000-0000-0000-0000-000000000002' WHERE id = 'c0000000-0000-0000-0000-000000000002';

-- Seed Products
INSERT INTO public.products (id, farmer_id, category_id, title, description, price_per_unit, unit, image_url, is_active) VALUES
('a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 1, 'Organic Tomato', 'Freshly plucked country heirlooms', 35.00, 'kg', '', true),
('a0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', 1, 'Red Onion', 'Crisp local salad onions', 25.00, 'kg', '', true),
('a0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', 1, 'Sweet Carrot', 'Crunchy orange field carrots', 45.00, 'kg', '', true),
('a0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000002', 1, 'Fresh Potato', 'Muddy red potatoes for cooking', 30.00, 'kg', '', true),
('a0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000002', 2, 'Ripe Banana', 'Sweet local Cavendish bunch', 50.00, 'dozen', '', true),
('a0000000-0000-0000-0000-000000000006', 'f0000000-0000-0000-0000-000000000002', 1, 'Local Spinach', 'Tender dark green leafy bunch', 20.00, 'bundle', '', true),
('a0000000-0000-0000-0000-000000000007', 'f0000000-0000-0000-0000-000000000001', 1, 'Purple Brinjal', 'Glossy locally harvested eggplants', 40.00, 'kg', '', true),
('a0000000-0000-0000-0000-000000000008', 'f0000000-0000-0000-0000-000000000002', 5, 'Basmati Rice', 'Long grain premium quality farm rice', 95.00, 'kg', '', true)
ON CONFLICT (id) DO NOTHING;

-- Seed Inventory levels
INSERT INTO public.inventory (id, product_id, stock_quantity, low_stock_threshold) VALUES
('90000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 150, 10),
('90000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 200, 15),
('90000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 80, 10),
('90000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004', 300, 20),
('90000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005', 40, 5),
('90000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000006', 60, 12),
('90000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000007', 75, 10),
('90000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000008', 500, 50)
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Customer Orders
INSERT INTO public.orders (id, customer_id, total_amount, status, payment_status, delivery_address_id) VALUES
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 145.00, 'CONFIRMED', 'PAID', 'e0000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Order Items
INSERT INTO public.order_items (id, order_id, product_id, farmer_id, quantity, price_per_unit, subtotal) VALUES
('80000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 2, 35.00, 70.00),
('80000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', 1, 45.00, 45.00),
('80000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000002', 1, 30.00, 30.00)
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Payments
INSERT INTO public.payments (order_id, amount, payment_method, status, transaction_reference) VALUES
('d0000000-0000-0000-0000-000000000001', 145.00, 'UPI', 'SUCCESS', 'TXN-902183901')
ON CONFLICT (order_id) DO NOTHING;

-- Seed Deliveries
INSERT INTO public.deliveries (order_id, delivery_person_name, delivery_person_phone, status, estimated_delivery_time) VALUES
('d0000000-0000-0000-0000-000000000001', 'Raju Courier', '+91 9999988888', 'ASSIGNED', now() + interval '3 hours')
ON CONFLICT (order_id) DO NOTHING;

-- Seed Product Reviews
INSERT INTO public.reviews (product_id, customer_id, rating, comment) VALUES
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 5, 'Super juicy country tomatoes, will buy again!')
ON CONFLICT (product_id, customer_id) DO NOTHING;


-- --------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Anonymous / Client Read access to active products and categories
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Active Products" ON public.products FOR SELECT USING (is_active = true OR auth.uid() = farmer_id);
CREATE POLICY "Public Read Product Images" ON public.product_images FOR SELECT USING (true);

-- Customer specific policies
CREATE POLICY "Customer Manage Carts" ON public.carts FOR ALL USING (auth.uid() = customer_id);
CREATE POLICY "Customer Manage Cart Items" ON public.cart_items FOR ALL USING (
    cart_id IN (SELECT id FROM public.carts WHERE customer_id = auth.uid())
);
CREATE POLICY "Customer Manage Wishlist" ON public.wishlist FOR ALL USING (auth.uid() = customer_id);
CREATE POLICY "Customer View Orders" ON public.orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Customer Write Reviews" ON public.reviews FOR ALL USING (auth.uid() = customer_id);

-- Farmer specific policies
CREATE POLICY "Farmers Manage Products" ON public.products FOR ALL USING (auth.uid() = farmer_id);
CREATE POLICY "Farmers Manage Product Images" ON public.product_images FOR ALL USING (
    product_id IN (SELECT id FROM public.products WHERE farmer_id = auth.uid())
);
CREATE POLICY "Farmers Manage Inventory" ON public.inventory FOR ALL USING (
    product_id IN (SELECT id FROM public.products WHERE farmer_id = auth.uid())
);
CREATE POLICY "Farmers View Related Order Items" ON public.order_items FOR SELECT USING (
    farmer_id = auth.uid()
);

-- Admin specific policies (Access to all tables, handled via service-role / DB admin superuser)


-- ====================================================================
-- 10. DATABASE VERIFICATION & TESTING QUERIES
-- ====================================================================

/*
-- Query 1: Verify All Tables Exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Query 2: Verify Foreign Keys & Constraints
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public';

-- Query 3: Multi-Table JOIN Example (Customer -> Order -> Order Item -> Product -> Farmer)
SELECT 
    c.full_name AS customer_name,
    o.id AS order_id,
    o.total_amount,
    oi.quantity,
    p.title AS product_name,
    f.farm_name
FROM public.orders o
JOIN public.customer_profiles c ON o.customer_id = c.id
JOIN public.order_items oi ON o.id = oi.order_id
JOIN public.products p ON oi.product_id = p.id
JOIN public.farmer_profiles f ON p.farmer_id = f.id;

-- Query 4: Category -> Product -> Inventory JOIN Example
SELECT 
    cat.name AS category_name,
    p.title AS product_name,
    p.price_per_unit,
    p.unit,
    inv.stock_quantity
FROM public.categories cat
JOIN public.products p ON cat.id = p.category_id
JOIN public.inventory inv ON p.id = inv.product_id;
*/

