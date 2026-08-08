-- Lead geo for admin outbound map pins (nullable for legacy CSV imports).
ALTER TABLE lead_candidates
  ADD COLUMN IF NOT EXISTS lat double precision,
  ADD COLUMN IF NOT EXISTS lng double precision;

COMMENT ON COLUMN lead_candidates.lat IS 'WGS84 latitude from Places; null for CSV imports without geo';
COMMENT ON COLUMN lead_candidates.lng IS 'WGS84 longitude from Places; null for CSV imports without geo';
