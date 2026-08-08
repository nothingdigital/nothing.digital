-- Approved Instantly one-line personalization (HITL only; never auto-export unapproved).
ALTER TABLE lead_candidates
  ADD COLUMN IF NOT EXISTS personalization text;

COMMENT ON COLUMN lead_candidates.personalization IS
  'Approved one-line Instantly custom variable; HITL only.';
