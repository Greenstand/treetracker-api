CREATE INDEX IF NOT EXISTS tree_est_gmtric_loc_idx_gist_gg ON tree USING gist (((estimated_geographic_location)::public.geography));
CREATE INDEX IF NOT EXISTS capture_captured_at_idx ON capture(captured_at);

