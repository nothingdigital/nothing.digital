-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  service text,
  budget text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text NOT NULL UNIQUE,
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  unsubscribed_at timestamptz
);

-- Portfolio case studies
CREATE TABLE IF NOT EXISTS portfolio_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  client text NOT NULL,
  industry text,
  services text[] DEFAULT '{}',
  summary text NOT NULL,
  challenge text,
  solution text,
  results text,
  tech_stack text[] DEFAULT '{}',
  testimonial text,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Anon can insert contact submissions (from public website form)
DO $$
BEGIN
  CREATE POLICY contact_submissions_anon_insert
    ON contact_submissions
    FOR INSERT
    TO anon
    WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- Anon can insert newsletter subscribers
DO $$
BEGIN
  CREATE POLICY newsletter_subscribers_anon_insert
    ON newsletter_subscribers
    FOR INSERT
    TO anon
    WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- No public reads on any table
DO $$
BEGIN
  CREATE POLICY contact_submissions_no_public_select
    ON contact_submissions
    FOR SELECT
    TO anon
    USING (false);
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY newsletter_subscribers_no_public_select
    ON newsletter_subscribers
    FOR SELECT
    TO anon
    USING (false);
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY portfolio_items_no_public_select
    ON portfolio_items
    FOR SELECT
    TO anon
    USING (false);
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- Service role has full access (used by server-side API routes)
DO $$
BEGIN
  CREATE POLICY contact_submissions_service_all
    ON contact_submissions
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY newsletter_subscribers_service_all
    ON newsletter_subscribers
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY portfolio_items_service_all
    ON portfolio_items
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;
