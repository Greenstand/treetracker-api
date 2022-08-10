ALTER TABLE capture ADD COLUMN tree_id uuid NOT NULL;
ALTER TABLE capture ADD CONSTRAINT capture_tree_id_fkey FOREIGN KEY (tree_id) references tree(id);