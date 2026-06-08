-- Down migration for 0001_init (ROLLBACK-001). Destructive: drops all data.
DROP TABLE IF EXISTS weekly_top_repositories;
DROP TABLE IF EXISTS repo_snapshots;
DROP TABLE IF EXISTS analysis_locks;
DROP TABLE IF EXISTS usage_events;
DROP TABLE IF EXISTS analysis_cache;
