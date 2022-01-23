ALTER TABLE capture DROP COLUMN status;
ALTER TABLE capture ADD COLUMN status status NOT NULL DEFAULT 'active';