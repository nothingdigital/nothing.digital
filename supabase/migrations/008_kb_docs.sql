-- Admin knowledge base (Confluence-style docs). Private Storage + staff RLS.
-- ponytail: body is markdown TEXT (not TipTap JSON).

CREATE TABLE IF NOT EXISTS kb_spaces (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kb_nodes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id uuid NOT NULL REFERENCES kb_spaces (id) ON DELETE CASCADE,
  parent_id uuid REFERENCES kb_nodes (id) ON DELETE RESTRICT,
  type text NOT NULL CHECK (type IN ('folder', 'page')),
  title text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS kb_nodes_space_id_idx ON kb_nodes (space_id);
CREATE INDEX IF NOT EXISTS kb_nodes_parent_id_idx ON kb_nodes (parent_id);

CREATE TABLE IF NOT EXISTS kb_pages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  node_id uuid NOT NULL UNIQUE REFERENCES kb_nodes (id) ON DELETE CASCADE,
  body text NOT NULL DEFAULT '',
  body_text text,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'in_review', 'approved')),
  current_version integer NOT NULL DEFAULT 1,
  approved_version integer,
  requires_ack boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kb_versions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id uuid NOT NULL REFERENCES kb_pages (id) ON DELETE CASCADE,
  version integer NOT NULL,
  body text NOT NULL DEFAULT '',
  status text NOT NULL
    CHECK (status IN ('draft', 'in_review', 'approved')),
  author_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (page_id, version)
);

CREATE INDEX IF NOT EXISTS kb_versions_page_id_idx ON kb_versions (page_id);

CREATE TABLE IF NOT EXISTS kb_attachments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id uuid NOT NULL REFERENCES kb_pages (id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  filename text NOT NULL,
  mime text,
  kind text NOT NULL DEFAULT 'attachment'
    CHECK (kind IN ('import_original', 'attachment')),
  byte_size integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS kb_attachments_page_id_idx ON kb_attachments (page_id);

CREATE TABLE IF NOT EXISTS kb_acknowledgments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id uuid NOT NULL REFERENCES kb_pages (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  version integer NOT NULL,
  acked_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (page_id, user_id, version)
);

CREATE INDEX IF NOT EXISTS kb_acknowledgments_page_id_idx ON kb_acknowledgments (page_id);

-- RLS: anon deny, service_role all, authenticated staff via is_staff()
ALTER TABLE kb_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_acknowledgments ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  CREATE POLICY kb_spaces_no_public_select
    ON kb_spaces FOR SELECT TO anon USING (false);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY kb_nodes_no_public_select
    ON kb_nodes FOR SELECT TO anon USING (false);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY kb_pages_no_public_select
    ON kb_pages FOR SELECT TO anon USING (false);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY kb_versions_no_public_select
    ON kb_versions FOR SELECT TO anon USING (false);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY kb_attachments_no_public_select
    ON kb_attachments FOR SELECT TO anon USING (false);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY kb_acknowledgments_no_public_select
    ON kb_acknowledgments FOR SELECT TO anon USING (false);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY kb_spaces_service_all
    ON kb_spaces FOR ALL TO service_role USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY kb_nodes_service_all
    ON kb_nodes FOR ALL TO service_role USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY kb_pages_service_all
    ON kb_pages FOR ALL TO service_role USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY kb_versions_service_all
    ON kb_versions FOR ALL TO service_role USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY kb_attachments_service_all
    ON kb_attachments FOR ALL TO service_role USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY kb_acknowledgments_service_all
    ON kb_acknowledgments FOR ALL TO service_role USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'is_staff'
  ) THEN
    CREATE POLICY kb_spaces_staff_all
      ON kb_spaces FOR ALL TO authenticated USING (is_staff()) WITH CHECK (is_staff());
    CREATE POLICY kb_nodes_staff_all
      ON kb_nodes FOR ALL TO authenticated USING (is_staff()) WITH CHECK (is_staff());
    CREATE POLICY kb_pages_staff_all
      ON kb_pages FOR ALL TO authenticated USING (is_staff()) WITH CHECK (is_staff());
    CREATE POLICY kb_versions_staff_all
      ON kb_versions FOR ALL TO authenticated USING (is_staff()) WITH CHECK (is_staff());
    CREATE POLICY kb_attachments_staff_all
      ON kb_attachments FOR ALL TO authenticated USING (is_staff()) WITH CHECK (is_staff());
    CREATE POLICY kb_acknowledgments_staff_all
      ON kb_acknowledgments FOR ALL TO authenticated USING (is_staff()) WITH CHECK (is_staff());
  END IF;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kb-docs',
  'kb-docs',
  false,
  15728640,
  ARRAY[
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/x-iwork-numbers-sffnumbers',
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/octet-stream'
  ]
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO kb_spaces (title, slug, sort_order)
VALUES
  ('HR', 'hr', 1),
  ('Legal', 'legal', 2),
  ('Templates', 'templates', 3),
  ('Business logic', 'business-logic', 4)
ON CONFLICT (slug) DO NOTHING;
