ALTER TABLE capture DROP COLUMN device_identifier;
ALTER TABLE capture ADD COLUMN device_configuration_id uuid;