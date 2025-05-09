require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const Knex = require('knex');
const Crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const knex = Knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
});

(async () => {
  const apiKey = uuidv4();

  const hash = Crypto.createHmac('sha512', 'treetrcker');
  hash.update(apiKey);
  const value = hash.digest('hex');

  const trx = await knex.transaction();

  try {
    // create API key
    const apiKeyData = {
      key: value,
    };

    await trx('treetracker.api_key').insert(apiKeyData).returning('*');

    await trx.commit();
    knex.destroy();

    console.log(`api key ${apiKey}`);
  } catch (error) {
    console.log(error);
    await trx.rollback();
    knex.destroy();
  }
})().catch((e) => console.error(e.stack));
