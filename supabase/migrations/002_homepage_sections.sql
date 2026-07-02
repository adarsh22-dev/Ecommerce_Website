-- Homepage Sections CMS
create table if not exists public.homepage_sections (
  id uuid default gen_random_uuid() primary key,
  type text not null check (type in (
    'hero', 'trust_badges', 'categories', 'products_grid',
    'banner', 'instagram', 'newsletter', 'custom_text', 'featured_products'
  )),
  title text,
  subtitle text,
  settings jsonb default '{}'::jsonb,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Settings JSON structure per type:
-- hero:        { "slides": [{ "image_url": "", "heading": "", "subheading": "", "cta_text": "", "cta_link": "" }] }
-- trust_badges: {} (uses defaults)
-- categories:  { "title": "", "subtitle": "", "category_ids": [] }
-- products_grid: { "title": "", "subtitle": "", "product_ids": [], "layout": "grid|carousel" }
-- banner:      { "image_url": "", "cta_text": "", "cta_link": "", "bg_color": "", "text_color": "" }
-- instagram:   { "title": "", "subtitle": "", "access_token": "", "username": "", "limit": 8 }
-- newsletter:  { "title": "", "subtitle": "" }
-- custom_text: { "content_html": "" }
-- featured_products: { "title": "", "subtitle": "", "sort_by": "newest|best-selling|on_sale", "limit": 8 }

alter table public.homepage_sections enable row level security;

create policy "Anyone can view active homepage sections"
  on public.homepage_sections for select
  using (true);

create policy "Only admins can manage homepage sections"
  on public.homepage_sections for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Seed default sections
insert into public.homepage_sections (type, title, subtitle, settings, sort_order) values
  ('hero', null, null, jsonb_build_object(
    'slides', jsonb_build_array(
      jsonb_build_object('image_url', 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=900&fit=crop', 'heading', 'Curated Collections', 'subheading', 'Discover pieces that define your style', 'cta_text', 'Shop Now', 'cta_link', '/products'),
      jsonb_build_object('image_url', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=900&fit=crop', 'heading', 'New Season Edit', 'subheading', 'Fresh arrivals for the modern lifestyle', 'cta_text', 'Explore', 'cta_link', '/products?sort=newest'),
      jsonb_build_object('image_url', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&h=900&fit=crop', 'heading', 'Premium Quality', 'subheading', 'Crafted with care, built to last', 'cta_text', 'View Collection', 'cta_link', '/products')
    )
  ), 0),
  ('trust_badges', null, null, '{}'::jsonb, 1),
  ('categories', 'Shop by Category', 'Browse', '{}'::jsonb, 2),
  ('featured_products', 'New Arrivals', 'Just In', jsonb_build_object('sort_by', 'newest', 'limit', 8), 3),
  ('banner', 'Spring Sale', 'Limited Time', jsonb_build_object('image_url', '', 'cta_text', 'Shop the Sale', 'cta_link', '/products?on_sale=true', 'bg_color', '#1a1a1a', 'text_color', '#ffffff'), 4),
  ('featured_products', 'Best Sellers', 'Customer Favorites', jsonb_build_object('sort_by', 'best-selling', 'limit', 8), 5),
  ('newsletter', 'Join Our Newsletter', 'Stay Updated', jsonb_build_object('title', 'Join Our Newsletter', 'subtitle', 'Be the first to know about new arrivals, exclusive offers, and style inspiration.'), 6);
