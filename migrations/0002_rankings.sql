-- PHASE-3 (Vision) — unify Daily/Weekly/Niche rankings in weekly_top_repositories
-- via a period_type discriminator (DATA-003 decision: extend existing table).
-- Additive + non-destructive: existing rows become period_type='weekly'.
-- Reviewed migration (ARCH-009 / ROLLBACK-002). Down: 0002_rankings.down.sql

ALTER TABLE weekly_top_repositories ADD COLUMN IF NOT EXISTS period_type TEXT NOT NULL DEFAULT 'weekly';
ALTER TABLE weekly_top_repositories ADD COLUMN IF NOT EXISTS is_fallback BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE weekly_top_repositories ADD COLUMN IF NOT EXISTS data_source TEXT;
ALTER TABLE weekly_top_repositories ADD COLUMN IF NOT EXISTS calculated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Daily/niche rows do not have week-over-week deltas.
ALTER TABLE weekly_top_repositories ALTER COLUMN stars_delta DROP NOT NULL;
ALTER TABLE weekly_top_repositories ALTER COLUMN forks_delta DROP NOT NULL;

-- Uniqueness is now per (period_type, week_start, rank).
ALTER TABLE weekly_top_repositories DROP CONSTRAINT IF EXISTS weekly_top_repositories_week_start_rank_key;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'weekly_top_period_rank_uniq'
  ) THEN
    ALTER TABLE weekly_top_repositories
      ADD CONSTRAINT weekly_top_period_rank_uniq UNIQUE (period_type, week_start, rank);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_weekly_top_period ON weekly_top_repositories (period_type, week_start);
