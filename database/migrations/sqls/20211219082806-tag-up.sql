CREATE TABLE tag
(
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar NOT NULL,
    public boolean NOT NULL,
    status status NOT NULL DEFAULT 'active',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
