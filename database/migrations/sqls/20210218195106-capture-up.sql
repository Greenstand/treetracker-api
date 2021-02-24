CREATE TABLE capture
(
    id uuid NOT NULL PRIMARY KEY,
    reference_id int8 NOT NULL,
    tree_id uuid NULL,
    image_url varchar NOT NULL,
    lat numeric NOT NULL,
    lon numeric NOT NULL,
    estimated_geometric_location geometry(POINT, 4326) NOT NULL,
    gps_accuracy smallint NULL,
    planter_id int8 NOT NULL,
    planter_photo_url varchar NULL,
    planter_username varchar NOT NULL,
    planting_organization_id int4 NULL,
    device_identifier varchar NULL,
    species_id int4 NULL,
    morphology varchar NULL,
    age smallint NULL,
    note varchar NULL,
    attributes jsonb NULL, 
    domain_specific_data jsonb NULL,
    status varchar NOT NULL,
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL
);

CREATE INDEX capture_est_gmtric_loc_idx_gist ON capture USING gist (estimated_geometric_location);
CREATE INDEX capture_tree_idx ON CAPTURE(tree_id);
CREATE INDEX capture_status_idx ON capture(status);
CREATE INDEX capture_planter_idx ON capture(planter_id);
CREATE INDEX capture_planter_usrnm_idx ON capture(planter_username);
CREATE INDEX capture_crdate_idx ON capture(created_at);
CREATE INDEX capture_update_idx ON capture(updated_at);