CREATE TABLE grower_account
(
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id uuid NOT NULL,
    wallet varchar NOT NULL,
    person_id uuid,
    organization_id uuid,
    name varchar NOT NULL,
    email varchar,
    phone varchar,
    image_url varchar NOT NULL,
    image_rotation integer NOT NULL DEFAULT 0,
    status status NOT NULL DEFAULT 'active',
    first_registration_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
