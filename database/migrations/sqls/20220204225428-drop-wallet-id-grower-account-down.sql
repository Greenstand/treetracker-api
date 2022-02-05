/* Replace with your SQL commands */
ALTER TABLE grower_account ADD COLUMN wallet_id uuid NOT NULL;
DROP INDEX IF EXISTS wallet_idx;