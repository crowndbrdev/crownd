-- First-party, cookie-less analytics. No IPs stored: a visitor is a salted hash that rotates daily.
CREATE TABLE IF NOT EXISTS visits (
  visitor TEXT NOT NULL,
  day TEXT NOT NULL,
  edition TEXT,
  country TEXT,
  first_seen INTEGER NOT NULL,
  last_seen INTEGER NOT NULL,
  pageviews INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (visitor, day)
);
CREATE INDEX IF NOT EXISTS visits_last_seen ON visits(last_seen);
CREATE INDEX IF NOT EXISTS visits_day ON visits(day);

CREATE TABLE IF NOT EXISTS page_stats (
  day TEXT NOT NULL,
  path TEXT NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, path)
);
