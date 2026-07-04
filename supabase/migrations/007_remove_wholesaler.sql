-- Remove wholesaler-related tables and types
-- Run this in your Supabase SQL Editor

-- Drop wholesaler-related tables (order matters due to foreign keys)
DROP TABLE IF EXISTS public.wholesale_pricing CASCADE;
DROP TABLE IF EXISTS public.rfq_requests CASCADE;
DROP TABLE IF EXISTS public.wholesaler_profiles CASCADE;

-- Remove wholesaler from the user_role enum
-- PostgreSQL doesn't allow removing values from enums directly, so we create a new type and migrate
ALTER TYPE user_role RENAME TO user_role_old;

CREATE TYPE user_role AS ENUM ('customer', 'admin', 'vendor', 'super_admin');

ALTER TABLE public.profiles
  ALTER COLUMN role TYPE user_role
  USING role::text::user_role;

DROP TYPE IF EXISTS user_role_old;

-- Drop RLS policies that referenced wholesaler tables
DROP POLICY IF EXISTS "Wholesalers can view own profile" ON public.wholesaler_profiles;
DROP POLICY IF EXISTS "Wholesalers can update own profile" ON public.wholesaler_profiles;
DROP POLICY IF EXISTS "Admins can view all wholesalers" ON public.wholesaler_profiles;
DROP POLICY IF EXISTS "Admins can manage wholesalers" ON public.wholesaler_profiles;
DROP POLICY IF EXISTS "Anyone can view wholesale pricing" ON public.wholesale_pricing;
DROP POLICY IF EXISTS "Admins can manage wholesale pricing" ON public.wholesale_pricing;
DROP POLICY IF EXISTS "Users can view own RFQs" ON public.rfq_requests;
DROP POLICY IF EXISTS "Wholesalers can view assigned RFQs" ON public.rfq_requests;
DROP POLICY IF EXISTS "Users can create RFQs" ON public.rfq_requests;
DROP POLICY IF EXISTS "Admins can view all RFQs" ON public.rfq_requests;

-- Clean up feature flag
DELETE FROM public.feature_flags WHERE name = 'wholesaler_portal';
