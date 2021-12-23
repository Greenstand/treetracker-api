ALTER TABLE capture RENAME "planter_username" to "grower_username";
ALTER TABLE capture RENAME "planter_photo_url" to "grower_photo_url";
ALTER TABLE capture DROP COLUMN planter_id;
ALTER TABLE capture DROP COLUMN planting_organization_id;
ALTER TABLE capture ADD COLUMN grower_id uuid NOT NULL REFERENCES grower_account(id);
ALTER TABLE capture ADD COLUMN planting_organization_id uuid NOT NULL;
