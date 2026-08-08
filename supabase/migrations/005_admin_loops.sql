-- Admin task automation: open loops, checklists, outbound review queue

CREATE TABLE IF NOT EXISTS admin_loop_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  loop_key text NOT NULL,
  action text NOT NULL
    CHECK (action IN ('closed', 'snoozed', 'muted', 'reopened')),
  note text,
  snoozed_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_loop_events_loop_key_created_idx
  ON admin_loop_events (loop_key, created_at DESC);

CREATE TABLE IF NOT EXISTS ops_checklist_items (
  checklist_key text NOT NULL,
  item_key text NOT NULL,
  checked_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (checklist_key, item_key)
);

CREATE TABLE IF NOT EXISTS lead_candidates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_id uuid NOT NULL DEFAULT uuid_generate_v4(),
  place_id text NOT NULL,
  name text NOT NULL,
  website text,
  phone text,
  address text,
  city text NOT NULL DEFAULT 'Northport, AL',
  vertical text,
  query text,
  score integer NOT NULL DEFAULT 0,
  reasons text[] NOT NULL DEFAULT '{}',
  email text,
  email_source text NOT NULL DEFAULT 'none'
    CHECK (email_source IN ('hunter', 'mailto', 'none')),
  rating numeric,
  review_count integer,
  status text NOT NULL DEFAULT 'needs_email'
    CHECK (status IN ('needs_email', 'ready', 'approved', 'rejected', 'suppressed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (run_id, place_id)
);

CREATE INDEX IF NOT EXISTS lead_candidates_status_idx ON lead_candidates (status);
CREATE INDEX IF NOT EXISTS lead_candidates_score_idx ON lead_candidates (score DESC);
CREATE INDEX IF NOT EXISTS lead_candidates_run_id_idx ON lead_candidates (run_id);

CREATE TABLE IF NOT EXISTS do_not_contact (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email_or_domain text NOT NULL UNIQUE,
  reason text,
  added_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS do_not_contact_value_idx ON do_not_contact (email_or_domain);

ALTER TABLE admin_loop_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE do_not_contact ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  CREATE POLICY admin_loop_events_no_public_select
    ON admin_loop_events FOR SELECT TO anon USING (false);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY ops_checklist_items_no_public_select
    ON ops_checklist_items FOR SELECT TO anon USING (false);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY lead_candidates_no_public_select
    ON lead_candidates FOR SELECT TO anon USING (false);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY do_not_contact_no_public_select
    ON do_not_contact FOR SELECT TO anon USING (false);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY admin_loop_events_service_all
    ON admin_loop_events FOR ALL TO service_role USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY ops_checklist_items_service_all
    ON ops_checklist_items FOR ALL TO service_role USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY lead_candidates_service_all
    ON lead_candidates FOR ALL TO service_role USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY do_not_contact_service_all
    ON do_not_contact FOR ALL TO service_role USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
