ALTER TABLE tree DROP COLUMN status;
ALTER TABLE tree ADD COLUMN status status NOT NULL DEFAULT 'active';