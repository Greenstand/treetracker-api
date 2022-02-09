/* Replace with your SQL commands */
ALTER TABLE capture RENAME "grower_id" to "grower_account_id";
CREATE INDEX grwr_act_idx ON capture(grower_account_id);