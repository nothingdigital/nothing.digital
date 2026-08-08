-- Invoice PDFs + generic client documents (private Storage + view tokens)

ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS storage_path text,
  ADD COLUMN IF NOT EXISTS view_token text,
  ADD COLUMN IF NOT EXISTS sent_emailed_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS invoices_view_token_uidx
  ON invoices (view_token)
  WHERE view_token IS NOT NULL;

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id uuid NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  title text NOT NULL,
  kind text NOT NULL DEFAULT 'other'
    CHECK (kind IN ('contract', 'msa', 'sow', 'invoice', 'other')),
  storage_path text,
  view_token text,
  external_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS documents_client_id_idx ON documents (client_id);

CREATE UNIQUE INDEX IF NOT EXISTS documents_view_token_uidx
  ON documents (view_token)
  WHERE view_token IS NOT NULL;

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  CREATE POLICY documents_no_public_select
    ON documents FOR SELECT TO anon USING (false);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY documents_service_all
    ON documents FOR ALL TO service_role USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('invoices', 'invoices', false, 15728640, ARRAY['application/pdf']),
  ('documents', 'documents', false, 15728640, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;
