CREATE TABLE tree
(
    id uuid NOT NULL PRIMARY KEY,
    latest_capture_id uuid NOT NULL,
    image_url varchar NOT NULL,
    lat numeric NOT NULL,
    lon numeric NOT NULL,
    estimated_geometric_location geometry(POINT, 4326) NOT NULL,
    gps_accuracy smallint NULL,
    species_id int4 NULL,
    morphology varchar NULL,
    age smallint NULL,
    status varchar NOT NULL,
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL
);

CREATE INDEX tree_est_gmtric_loc_idx_gist ON tree USING gist (estimated_geometric_location);
CREATE INDEX tree_status_idx ON tree(status);
CREATE INDEX tree_crdate_idx ON tree(created_at);
CREATE INDEX tree_update_idx ON tree(updated_at);
