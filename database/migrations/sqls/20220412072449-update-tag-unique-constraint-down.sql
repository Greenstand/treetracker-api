ALTER TABLE tag DROP CONSTRAINT tag_name_owner_id_unique;
ALTER TABLE tag ADD CONSTRAINT tag_name_unique UNIQUE (name);