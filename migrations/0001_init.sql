-- PHASE-2 / PHASE-5 initial schema for "What's in it?"
-- Reviewed migration (ARCH-009 / ROLLBACK-001). Run via: npm run migrate
-- Idempotent: safe to re-run. Down migration: 0001_init.down.sql

-- DATA-002: analysis_cache — one validated analysis per repo_key.
CREATE TABLE IF NOT EXISTS analysis_cache (
  id              TEXT PRIMARY KEY,
  repo_key        TEXT NOT NULL UNIQUE,
  owner           TEXT NOT NULL,
  repo            TEXT NOT NULL,
  github_url      TEXT NOT NULL,
  analysis_json   JSONB NOT NULL,
  repo_metadata_json JSONB NOT NULL,
  provider        TEXT NOT NULL DEFAULT 'openrouter',
  model           TEXT NOT NULL,
  analyzer_version TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_accessed_at TIMESTAMPTZ,
  access_count    INTEGER NOT NULL DEFAULT 0,
  is_stale        BOOLEAN NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS idx_analysis_cache_updated_at ON analysis_cache (updated_at);
CREATE INDEX IF NOT EXISTS idx_analysis_cache_is_stale ON analysis_cache (is_stale);
CREATE INDEX IF NOT EXISTS idx_analysis_cache_access_count ON analysis_cache (access_count);

-- DATA-003: usage_events — abuse/cost monitoring, hashes only (no raw PII).
CREATE TABLE IF NOT EXISTS usage_events (
  id              BIGSERIAL PRIMARY KEY,
  event_type      TEXT NOT NULL,
  repo_key        TEXT,
  ip_hash         TEXT,
  session_hash    TEXT,
  user_agent_hash TEXT,
  provider        TEXT,
  model           TEXT,
  estimated_input_tokens  INTEGER,
  estimated_output_tokens INTEGER,
  estimated_cost  NUMERIC(12,6),
  cache_hit       BOOLEAN NOT NULL DEFAULT false,
  status          TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_usage_events_created_at ON usage_events (created_at);
CREATE INDEX IF NOT EXISTS idx_usage_events_event_type ON usage_events (event_type);
CREATE INDEX IF NOT EXISTS idx_usage_events_ip_created ON usage_events (ip_hash, created_at);
CREATE INDEX IF NOT EXISTS idx_usage_events_repo_created ON usage_events (repo_key, created_at);

-- DATA-004: analysis_locks — at most one OpenRouter call per repo_key.
CREATE TABLE IF NOT EXISTS analysis_locks (
  repo_key    TEXT PRIMARY KEY,
  lock_id     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'running',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at  TIMESTAMPTZ NOT NULL,
  error_code  TEXT
);
CREATE INDEX IF NOT EXISTS idx_analysis_locks_expires_at ON analysis_locks (expires_at);

-- DATA-005: repo_snapshots — GitHub metrics over time for weekly scoring.
CREATE TABLE IF NOT EXISTS repo_snapshots (
  id            BIGSERIAL PRIMARY KEY,
  repo_key      TEXT NOT NULL,
  owner         TEXT NOT NULL,
  repo          TEXT NOT NULL,
  stars         INTEGER NOT NULL,
  forks         INTEGER NOT NULL,
  open_issues   INTEGER,
  language      TEXT,
  pushed_at     TIMESTAMPTZ,
  updated_at    TIMESTAMPTZ,
  created_at_github TIMESTAMPTZ,
  license       TEXT,
  topics_json   JSONB,
  archived      BOOLEAN,
  disabled      BOOLEAN,
  snapshot_date DATE NOT NULL,
  created_at_record TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (repo_key, snapshot_date)
);
CREATE INDEX IF NOT EXISTS idx_repo_snapshots_snapshot_date ON repo_snapshots (snapshot_date);
CREATE INDEX IF NOT EXISTS idx_repo_snapshots_language ON repo_snapshots (language);

-- DATA-006: weekly_top_repositories — ranked weekly list for homepage/trending.
CREATE TABLE IF NOT EXISTS weekly_top_repositories (
  id            BIGSERIAL PRIMARY KEY,
  week_start    DATE NOT NULL,
  week_end      DATE NOT NULL,
  rank          INTEGER NOT NULL CHECK (rank BETWEEN 1 AND 10),
  repo_key      TEXT NOT NULL,
  owner         TEXT NOT NULL,
  repo          TEXT NOT NULL,
  github_url    TEXT NOT NULL,
  description   TEXT,
  language      TEXT,
  stars         INTEGER NOT NULL,
  forks         INTEGER NOT NULL,
  stars_delta   INTEGER NOT NULL,
  forks_delta   INTEGER NOT NULL,
  weekly_score  DOUBLE PRECISION NOT NULL,
  reason        TEXT NOT NULL,
  analysis_cache_id TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (week_start, rank)
);
CREATE INDEX IF NOT EXISTS idx_weekly_top_week_start ON weekly_top_repositories (week_start);
CREATE INDEX IF NOT EXISTS idx_weekly_top_repo_key ON weekly_top_repositories (repo_key);
