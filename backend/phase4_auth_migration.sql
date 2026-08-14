-- ====================================================================
-- PHASE 4: AUTHENTICATION & ROLE-BASED ACCESS CONTROL SCHEMA MIGRATION
-- Run this script in Supabase Dashboard -> SQL Editor if not already applied.
-- ====================================================================

-- 1. Ensure public.users table has all Phase 4 authentication fields
ALTER TABLE public.users 
    ADD COLUMN IF NOT EXISTS name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS password VARCHAR(255),
    ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'ACTIVE';

-- 2. Make sure default UUID generation works on public.users
ALTER TABLE public.users 
    ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 3. If foreign key to auth.users exists and standalone Spring Boot auth is desired,
-- you may optionally drop the foreign key constraint or maintain it:
-- ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- 4. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_users_email_status ON public.users(email, status);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- ====================================================================
-- SEED INITIAL ADMIN USER (Optional direct SQL creation):
-- BCrypt hash for "Admin@Farmer2026!":
-- $2a$12$eImiTXuWVxfM37uY4JANjOL.PtkV4i9G2qX3y79e3W4vN1B0r7GvW
-- ====================================================================
INSERT INTO public.users (id, name, email, password, phone, role, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'Platform Administrator',
    'admin@farmersmarket.local',
    '$2a$12$eImiTXuWVxfM37uY4JANjOL.PtkV4i9G2qX3y79e3W4vN1B0r7GvW',
    '+91-9999999999',
    'ADMIN',
    'ACTIVE',
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
)
ON CONFLICT (email) DO UPDATE 
SET role = 'ADMIN',
    status = 'ACTIVE',
    password = EXCLUDED.password;
