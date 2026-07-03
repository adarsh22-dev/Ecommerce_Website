-- Run this in the Supabase SQL Editor to fix RLS recursion
-- https://supabase.com/dashboard/project/pwutyibfjskhlzldmjdg/sql/new

-- 1. Create admin check function (bypasses RLS)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 2. Drop all old admin policies that cause recursion
DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE policyname LIKE 'Admins can%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', rec.policyname, rec.tablename);
  END LOOP;
END $$;

-- 3. Recreate all admin policies using the function
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (is_admin());

-- 3a. Allow users to manage their own profile (needed for signup & Setup)
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all products" ON products FOR SELECT USING (is_admin());
CREATE POLICY "Admins can insert products" ON products FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update products" ON products FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete products" ON products FOR DELETE USING (is_admin());

CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (is_admin());
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can view all order items" ON order_items FOR SELECT USING (is_admin());
CREATE POLICY "Admins can delete reviews" ON reviews FOR DELETE USING (is_admin());
CREATE POLICY "Admins can manage coupons" ON coupons FOR ALL USING (is_admin());
CREATE POLICY "Admins can update site settings" ON site_settings FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can view all hero slides" ON hero_slides FOR SELECT USING (is_admin());
CREATE POLICY "Admins can manage hero slides" ON hero_slides FOR ALL USING (is_admin());
CREATE POLICY "Admins can delete media" ON media FOR DELETE USING (is_admin());
CREATE POLICY "Admins can update SEO settings" ON seo_settings FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can manage page SEO" ON page_seo FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage product images" ON product_images FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage product options" ON product_options FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage option values" ON product_option_values FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage product variants" ON product_variants FOR ALL USING (is_admin());
CREATE POLICY "Admins can view all order timeline" ON order_timeline FOR SELECT USING (is_admin());
CREATE POLICY "Admins can insert order timeline" ON order_timeline FOR INSERT WITH CHECK (is_admin());

-- 4. Also drop the old trigger since it may cause issues
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_admin_signup();
