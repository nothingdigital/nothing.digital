-- Optional external uptime monitor URL on client assets (UptimeRobot/Kuma status page).
-- Plain URL field only — no API integration.

ALTER TABLE client_assets
  ADD COLUMN IF NOT EXISTS monitor_url text;
