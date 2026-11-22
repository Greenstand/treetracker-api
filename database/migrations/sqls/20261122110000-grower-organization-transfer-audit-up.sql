CREATE TABLE treetracker.grower_organization_transfer (
 id uuid PRIMARY KEY,
 request_id uuid NOT NULL UNIQUE,
 request_hash varchar(64) NOT NULL,
 grower_account_id uuid NOT NULL REFERENCES treetracker.grower_account(id),
 previous_organization_id uuid,
 new_organization_id uuid NOT NULL,
 administrator_id uuid NOT NULL,
 administrator_name text NOT NULL,
 reason text NOT NULL CHECK (length(btrim(reason)) BETWEEN 1 AND 1000),
 closed_project_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX grower_organization_transfer_history ON treetracker.grower_organization_transfer(grower_account_id,created_at DESC);
