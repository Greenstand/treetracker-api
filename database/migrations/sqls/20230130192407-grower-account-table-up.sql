CREATE TABLE grower_account_image
(
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    grower_account_id uuid NOT NULL REFERENCES grower_account(id),
    image_url varchar NOT NULL,
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
