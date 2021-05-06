/* Replace with your SQL commands */
DROP INDEX IF EXISTS capture_est_gmtric_loc_idx_gist;
DROP INDEX IF EXISTS tree_est_gmtric_loc_idx_gist;

ALTER TABLE tree RENAME "estimated_geometric_location" TO "location";
ALTER TABLE capture RENAME "estimated_geometric_location" TO "location";
