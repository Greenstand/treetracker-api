ALTER TABLE capture RENAME "grower_username" to "planter_username";
ALTER TABLE capture RENAME "grower_photo_url" to "planter_photo_url";
ALTER TABLE capture DROP COLUMN grower_id;
ALTER TABLE capture DROP COLUMN planting_organization_id;
ALTER TABLE capture ADD COLUMN planter_id int8;
ALTER TABLE capture ADD COLUMN planting_organization_id int4;