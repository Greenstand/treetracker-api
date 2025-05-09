CREATE TABLE api_key
(
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    key varchar NOT NULL UNIQUE,
    created_at timestamptz NOT NULL DEFAULT now()
);
