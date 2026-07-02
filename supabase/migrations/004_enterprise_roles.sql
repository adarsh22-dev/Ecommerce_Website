-- =====================================================
-- ECOM Enterprise Commerce Platform - Multi-Role Schema
-- =====================================================

-- Update user_role enum to include vendor, wholesaler, super_admin
-- Each ALTER TYPE must be in its own DO block (PostgreSQL limitation)
DO $$ BEGIN
  ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'vendor';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'wholesaler';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'super_admin';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- NEW TABLES
-- =====================================================

-- 1. Vendor Profiles
CREATE TABLE vendor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_description TEXT,
  business_logo_url TEXT,
  business_address TEXT,
  business_phone TEXT,
  business_email TEXT,
  tax_id TEXT,
  gst_number TEXT,
  pan_number TEXT,
  bank_account_number TEXT,
  bank_ifsc TEXT,
  bank_name TEXT,
  commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'suspended', 'rejected')),
  verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  rating NUMERIC(3, 2) DEFAULT 0,
  total_sales NUMERIC(12, 2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. Vendor Wallet
CREATE TABLE vendor_wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  pending_balance NUMERIC(12, 2) NOT NULL DEFAULT 0,
  available_balance NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_earned NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_withdrawn NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(vendor_id)
);

-- 3. Vendor Wallet Transactions
CREATE TABLE vendor_wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit', 'withdrawal', 'commission')),
  amount NUMERIC(12, 2) NOT NULL,
  description TEXT,
  reference_id UUID,
  reference_type TEXT,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Wholesaler Profiles
CREATE TABLE wholesaler_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_description TEXT,
  business_logo_url TEXT,
  business_address TEXT,
  business_phone TEXT,
  business_email TEXT,
  tax_id TEXT,
  gst_number TEXT,
  pan_number TEXT,
  min_order_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  credit_limit NUMERIC(12, 2) NOT NULL DEFAULT 0,
  credit_used NUMERIC(12, 2) NOT NULL DEFAULT 0,
  payment_terms_days INTEGER NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'suspended', 'rejected')),
  verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  rating NUMERIC(3, 2) DEFAULT 0,
  total_sales NUMERIC(12, 2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 5. Wholesale Pricing (Tiered pricing for products)
CREATE TABLE wholesale_pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  wholesaler_id UUID REFERENCES wholesaler_profiles(id) ON DELETE CASCADE,
  min_quantity INTEGER NOT NULL,
  max_quantity INTEGER,
  price_per_unit NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Request For Quote (RFQ)
CREATE TABLE rfq_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  wholesaler_id UUID REFERENCES wholesaler_profiles(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  specifications JSONB,
  target_price NUMERIC(10, 2),
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'accepted', 'rejected', 'expired')),
  quoted_price NUMERIC(10, 2),
  quoted_at TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Marketplace Vendor Subscriptions
CREATE TABLE vendor_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  plan_price NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Vendor Product Approvals
CREATE TABLE vendor_product_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  review_notes TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Customer Wallet
CREATE TABLE customer_wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  balance NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_earned NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_spent NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 10. Reward Points
CREATE TABLE reward_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  points INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  source TEXT,
  reference_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Gift Cards
CREATE TABLE gift_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  balance NUMERIC(10, 2) NOT NULL,
  initial_amount NUMERIC(10, 2) NOT NULL,
  buyer_id UUID REFERENCES profiles(id),
  recipient_email TEXT,
  recipient_name TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
  valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_to TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Audit Log
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Feature Flags
CREATE TABLE feature_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  target_roles TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. System Health
CREATE TABLE system_health (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'healthy' CHECK (status IN ('healthy', 'degraded', 'down')),
  response_time_ms INTEGER,
  last_check TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. API Keys
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  prefix TEXT NOT NULL,
  permissions TEXT[] DEFAULT '{}',
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_vendor_profiles_user ON vendor_profiles(user_id);
CREATE INDEX idx_vendor_profiles_status ON vendor_profiles(status);
CREATE INDEX idx_wholesaler_profiles_user ON wholesaler_profiles(user_id);
CREATE INDEX idx_wholesaler_profiles_status ON wholesaler_profiles(status);
CREATE INDEX idx_wholesale_pricing_product ON wholesale_pricing(product_id);
CREATE INDEX idx_rfq_requests_customer ON rfq_requests(customer_id);
CREATE INDEX idx_rfq_requests_wholesaler ON rfq_requests(wholesaler_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_feature_flags_name ON feature_flags(name);
CREATE INDEX idx_api_keys_user ON api_keys(user_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER update_vendor_profiles_updated_at
  BEFORE UPDATE ON vendor_profiles FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_wholesaler_profiles_updated_at
  BEFORE UPDATE ON wholesaler_profiles FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_rfq_requests_updated_at
  BEFORE UPDATE ON rfq_requests FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_feature_flags_updated_at
  BEFORE UPDATE ON feature_flags FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wholesaler_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wholesale_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfq_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_product_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Vendor policies
CREATE POLICY "Vendors can view own profile" ON vendor_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Vendors can update own profile" ON vendor_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all vendors" ON vendor_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
CREATE POLICY "Admins can manage vendors" ON vendor_profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Vendor wallet policies
CREATE POLICY "Vendors can view own wallet" ON vendor_wallets FOR SELECT USING (
  EXISTS (SELECT 1 FROM vendor_profiles WHERE id = vendor_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can view all vendor wallets" ON vendor_wallets FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Wholesaler policies
CREATE POLICY "Wholesalers can view own profile" ON wholesaler_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Wholesalers can update own profile" ON wholesaler_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all wholesalers" ON wholesaler_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
CREATE POLICY "Admins can manage wholesalers" ON wholesaler_profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Wholesale pricing policies
CREATE POLICY "Anyone can view wholesale pricing" ON wholesale_pricing FOR SELECT USING (true);
CREATE POLICY "Admins can manage wholesale pricing" ON wholesale_pricing FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- RFQ policies
CREATE POLICY "Users can view own RFQs" ON rfq_requests FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Wholesalers can view assigned RFQs" ON rfq_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM wholesaler_profiles WHERE id = wholesaler_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create RFQs" ON rfq_requests FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Admins can view all RFQs" ON rfq_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Gift cards policies
CREATE POLICY "Users can view gift cards" ON gift_cards FOR SELECT USING (
  auth.uid() = buyer_id OR recipient_email = (SELECT email FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Users can purchase gift cards" ON gift_cards FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Audit logs policies (admin only)
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Feature flags policies (super admin only)
CREATE POLICY "Super admins can manage feature flags" ON feature_flags FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- System health policies (admin only)
CREATE POLICY "Admins can view system health" ON system_health FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- API keys policies
CREATE POLICY "Users can view own API keys" ON api_keys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own API keys" ON api_keys FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- SEED DATA
-- =====================================================

INSERT INTO feature_flags (name, description, is_enabled) VALUES
  ('vendor_marketplace', 'Enable vendor marketplace features', true),
  ('wholesaler_portal', 'Enable wholesaler portal features', true),
  ('ai_assistants', 'Enable AI assistant features', true),
  ('advanced_analytics', 'Enable advanced analytics dashboard', true),
  ('multi_warehouse', 'Enable multi-warehouse management', false),
  ('rfq_system', 'Enable Request for Quote system', true),
  ('loyalty_program', 'Enable loyalty and rewards program', true),
  ('gift_cards', 'Enable gift card functionality', true)
ON CONFLICT (name) DO NOTHING;
