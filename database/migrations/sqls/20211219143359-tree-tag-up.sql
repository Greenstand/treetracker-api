CREATE TABLE tree_tag
(
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_id uuid NOT NULL REFERENCES tree(id),
    tag_id uuid NOT NULL REFERENCES tag(id),
    status status NOT NULL DEFAULT 'active',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
