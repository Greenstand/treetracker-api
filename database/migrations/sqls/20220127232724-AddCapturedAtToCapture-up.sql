/* Replace with your SQL commands */
ALTER TABLE capture ADD COLUMN captured_at timestamp with time zone;
UPDATE capture SET captured_at = now();
ALTER TABLE CAPTURE ALTER COLUMN captured_at SET NOT NULL;
