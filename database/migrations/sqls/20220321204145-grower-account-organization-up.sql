CREATE TABLE grower_account_org
(
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    grower_account_id uuid NOT NULL REFERENCES grower_account(id),
    organization_id uuid NOT NULL,
    status status NOT NULL DEFAULT 'active',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
