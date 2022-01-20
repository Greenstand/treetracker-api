DROP INDEX IF EXISTS tree_est_gmtric_loc_idx_gist;

ALTER TABLE tree RENAME "location" TO "estimated_geometric_location";

CREATE INDEX tree_est_gmtric_loc_idx_gist ON tree USING gist (estimated_geometric_location);