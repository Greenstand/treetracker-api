DROP INDEX IF EXISTS tree_est_gmtric_loc_idx_gist;

ALTER TABLE tree RENAME "estimated_geometric_location" TO "location";

CREATE INDEX tree_est_gmtric_loc_idx_gist ON tree USING gist (location);