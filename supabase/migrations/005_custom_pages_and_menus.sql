-- =====================================================
-- ECOM Custom Pages & Menu Management
-- =====================================================

-- 1. Custom Pages
CREATE TABLE custom_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT DEFAULT '',
  meta_title TEXT,
  meta_description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  show_in_footer BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Menu Items (nested structure via parent_id)
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  url TEXT,
  type TEXT NOT NULL DEFAULT 'custom' CHECK (type IN ('custom', 'category', 'page', 'divider', 'heading')),
  target_id UUID,
  parent_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_mega_menu BOOLEAN NOT NULL DEFAULT FALSE,
  mega_menu_columns INTEGER DEFAULT 1,
  icon TEXT,
  css_class TEXT,
  target_blank BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_custom_pages_slug ON custom_pages(slug);
CREATE INDEX idx_custom_pages_status ON custom_pages(status);
CREATE INDEX idx_menu_items_parent ON menu_items(parent_id);
CREATE INDEX idx_menu_items_type ON menu_items(type);

-- Triggers
CREATE TRIGGER update_custom_pages_updated_at
  BEFORE UPDATE ON custom_pages FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE custom_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Custom Pages policies
CREATE POLICY "Anyone can view published pages" ON custom_pages FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can view all pages" ON custom_pages FOR SELECT USING (is_admin());
CREATE POLICY "Admins can insert pages" ON custom_pages FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update pages" ON custom_pages FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete pages" ON custom_pages FOR DELETE USING (is_admin());

-- Menu Items policies
CREATE POLICY "Anyone can view active menu items" ON menu_items FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all menu items" ON menu_items FOR SELECT USING (is_admin());
CREATE POLICY "Admins can manage menu items" ON menu_items FOR ALL USING (is_admin());

-- Seed default menu items (main navigation)
INSERT INTO menu_items (label, type, url, sort_order, is_mega_menu) VALUES
  ('Shop', 'custom', '/products', 0, true),
  ('All Products', 'custom', '/products', 1, false),
  ('New Arrivals', 'custom', '/products?sort=newest', 2, false);

-- Seed footer menu items
INSERT INTO menu_items (label, type, url, sort_order) VALUES
  ('About', 'custom', '/about', 0),
  ('Contact', 'custom', '/contact', 1),
  ('FAQ', 'custom', '/faq', 2);
