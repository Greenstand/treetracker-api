const knex = require('../../../server/infra/database/knex');

before(async () => {
  await knex.raw(
    `
      CREATE TABLE IF NOT EXISTS public.planter
      (
          id serial,
          first_name character varying(30) COLLATE pg_catalog."default" NOT NULL,
          last_name character varying(30) COLLATE pg_catalog."default" NOT NULL,
          email character varying COLLATE pg_catalog."default",
          organization character varying COLLATE pg_catalog."default",
          phone text COLLATE pg_catalog."default",
          pwd_reset_required boolean DEFAULT false,
          image_url character varying COLLATE pg_catalog."default",
          person_id integer,
          organization_id integer,
          image_rotation integer,
          grower_account_uuid uuid,
          CONSTRAINT planter_id_key PRIMARY KEY (id)
      )`,
  );
});
