exports.seed = async function (knex) {
  await knex.raw(`
    DELETE FROM tree;    
    DELETE FROM capture;  
    DELETE FROM grower_account;
  `);
};
