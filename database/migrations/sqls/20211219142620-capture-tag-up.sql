CREATE TABLE capture_tag
(
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    capture_id uuid NOT NULL REFERENCES capture(id),
    tag_id uuid NOT NULL REFERENCES tag(id),
    status status NOT NULL DEFAULT 'active',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
