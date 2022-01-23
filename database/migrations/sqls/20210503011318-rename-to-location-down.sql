/* Replace with your SQL commands */
ALTER TABLE tree RENAME "location" TO "estimated_geometric_location";
ALTER TABLE capture RENAME "location" TO "estimated_geometric_location";

CREATE INDEX IF NOT EXISTS capture_est_gmtric_loc_idx_gist ON capture USING gist (estimated_geometric_location);
CREATE INDEX IF NOT EXISTS tree_est_gmtric_loc_idx_gist ON tree USING gist (estimated_geometric_location);