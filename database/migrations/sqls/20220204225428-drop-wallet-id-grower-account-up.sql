/* Replace with your SQL commands */
ALTER TABLE grower_account DROP COLUMN wallet_id;
CREATE UNIQUE INDEX wallet_idx ON grower_account(wallet);