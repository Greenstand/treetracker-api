DROP INDEX IF EXISTS capture_est_gmtric_loc_idx_gist;

ALTER TABLE capture RENAME "estimated_geometric_location" TO "location";

CREATE INDEX capture_est_gmtric_loc_idx_gist ON capture USING gist (location);