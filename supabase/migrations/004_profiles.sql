-- Secretary Phase B: profiles for app_role with RLS. Run after 003.
-- ponytail: min role system; full CRM in Phase C. is_staff() for policies.

CREATE TYPE app_role AS ENUM ('owner', 'staff');

CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  app_role app_role DEFAULT 'staff' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Owners can manage all profiles" ON profiles
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND app_role = 'owner'
    )
  );

-- Helper for RLS on other tables (staff = owner or staff)
CREATE OR REPLACE FUNCTION is_staff()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND app_role IN ('owner', 'staff')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- RLS for all tables (extend is_staff() for staff access, anon INSERT for forms)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anon insert contact" ON contact_submissions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Staff manage contact" ON contact_submissions FOR ALL TO authenticated USING (is_staff());

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anon insert newsletter" ON newsletter_subscribers FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Staff manage newsletter" ON newsletter_subscribers FOR ALL TO authenticated USING (is_staff());

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage clients" ON clients FOR ALL TO authenticated USING (is_staff());

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage invoices" ON invoices FOR ALL TO authenticated USING (is_staff());

ALTER TABLE client_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage assets" ON client_assets FOR ALL TO authenticated USING (is_staff());

ALTER TABLE client_work_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage work" ON client_work_items FOR ALL TO authenticated USING (is_staff());

ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS timeline text;

COMMENT ON TABLE profiles IS 'Secretary phase B: least-privilege roles. Owner manages staff. is_staff() for RLS.';
