/* Replace with your SQL commands */
ALTER TABLE capture RENAME "grower_account_id" to "grower_id";
DROP INDEX IF EXISTS grwr_act_idx;