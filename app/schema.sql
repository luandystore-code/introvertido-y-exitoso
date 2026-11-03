CREATE TABLE IF NOT EXISTS profiles (
  token_hash TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS entries (
  token_hash TEXT NOT NULL,
  entry_key TEXT NOT NULL,
  payload TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(token_hash, entry_key),
  FOREIGN KEY(token_hash) REFERENCES profiles(token_hash) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_entries_token ON entries(token_hash);
