DROP INDEX IF EXISTS capture_est_gmtric_loc_idx_gist;

ALTER TABLE capture RENAME "location" TO "estimated_geometric_location";

CREATE INDEX capture_est_gmtric_loc_idx_gist ON capture USING gist (estimated_geometric_location);