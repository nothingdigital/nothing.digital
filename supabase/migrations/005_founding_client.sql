-- Founding Client Package (Phase B on hire): is_founding flag, care dates for the 12 mo included.
-- Run after 004. Quota max 2 enforced in admin creation. Portfolio rights + testimonial in contract addendum.

ALTER TABLE clients ADD COLUMN IF NOT EXISTS is_founding boolean DEFAULT false;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS care_start timestamptz;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS care_end timestamptz;

COMMENT ON COLUMN clients.is_founding IS 'Founding Client flag for the $2,500 build + 12mo care (max 2 total).';
COMMENT ON COLUMN clients.care_start IS 'Launch date for the included care (12 months).';
COMMENT ON COLUMN clients.care_end IS 'End of included care (care_start + 12mo). Care invoices after.';

-- Example policy for founding care tracking (extend RLS if needed)
-- CREATE POLICY "Staff can manage founding care" ON clients FOR ALL TO authenticated USING (is_staff() OR is_founding);

-- Update existing clients if needed (one-time)
-- UPDATE clients SET is_founding = true, care_start = '2026-08-01', care_end = '2027-08-01' WHERE id IN (select the 2 founding ids);

ponytail: min columns + flag. Quota in admin creation. Care as work items or monthly invoice after 12mo. No new table. 
