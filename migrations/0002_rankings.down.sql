-- Down migration for 0002_rankings (ROLLBACK-002).
-- Restores the weekly-only shape. Removes daily/niche rows first.
DELETE FROM weekly_top_repositories WHERE period_type <> 'weekly';
ALTER TABLE weekly_top_repositories DROP CONSTRAINT IF EXISTS weekly_top_period_rank_uniq;
DROP INDEX IF EXISTS idx_weekly_top_period;
ALTER TABLE weekly_top_repositories DROP COLUMN IF EXISTS period_type;
ALTER TABLE weekly_top_repositories DROP COLUMN IF EXISTS is_fallback;
ALTER TABLE weekly_top_repositories DROP COLUMN IF EXISTS data_source;
ALTER TABLE weekly_top_repositories DROP COLUMN IF EXISTS calculated_at;
