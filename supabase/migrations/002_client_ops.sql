-- Client ops: accounts, billing, managed assets, work queue (admin-only via service role)

CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  primary_email text NOT NULL,
  company text,
  status text NOT NULL DEFAULT 'lead'
    CHECK (status IN ('lead', 'active', 'paused', 'churned')),
  billing_model text NOT NULL DEFAULT 'none'
    CHECK (billing_model IN ('project', 'retainer', 'hourly', 'none')),
  default_rate_cents integer,
  payment_terms text DEFAULT 'net_15',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id uuid NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  number text NOT NULL UNIQUE,
  title text NOT NULL,
  amount_cents integer NOT NULL CHECK (amount_cents >= 0),
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'void')),
  issued_at timestamptz,
  due_at timestamptz,
  paid_at timestamptz,
  external_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS invoices_client_id_idx ON invoices (client_id);
CREATE INDEX IF NOT EXISTS invoices_status_idx ON invoices (status);
CREATE INDEX IF NOT EXISTS clients_status_idx ON clients (status);

CREATE TABLE IF NOT EXISTS client_assets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id uuid NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  type text NOT NULL
    CHECK (type IN ('website', 'app', 'email', 'domain', 'hosting', 'other')),
  name text NOT NULL,
  url text,
  env text NOT NULL DEFAULT 'prod'
    CHECK (env IN ('prod', 'staging', 'dev')),
  managed_by_us boolean NOT NULL DEFAULT true,
  notes text,
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'handoff', 'retired')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS client_assets_client_id_idx ON client_assets (client_id);

CREATE TABLE IF NOT EXISTS client_work_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id uuid NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  asset_id uuid REFERENCES client_assets (id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'backlog'
    CHECK (status IN ('backlog', 'planned', 'in_progress', 'blocked', 'done')),
  priority text NOT NULL DEFAULT 'med'
    CHECK (priority IN ('low', 'med', 'high')),
  due_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS client_work_items_client_id_idx ON client_work_items (client_id);
CREATE INDEX IF NOT EXISTS client_work_items_status_idx ON client_work_items (status);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_work_items ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  CREATE POLICY clients_no_public_select
    ON clients FOR SELECT TO anon USING (false);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY invoices_no_public_select
    ON invoices FOR SELECT TO anon USING (false);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY client_assets_no_public_select
    ON client_assets FOR SELECT TO anon USING (false);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY client_work_items_no_public_select
    ON client_work_items FOR SELECT TO anon USING (false);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY clients_service_all
    ON clients FOR ALL TO service_role USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY invoices_service_all
    ON invoices FOR ALL TO service_role USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY client_assets_service_all
    ON client_assets FOR ALL TO service_role USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY client_work_items_service_all
    ON client_work_items FOR ALL TO service_role USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
