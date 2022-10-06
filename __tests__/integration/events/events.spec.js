const log = require('loglevel');
require('dotenv').config();
const Broker = require('rascal').BrokerAsPromised;
const { expect } = require('chai');
const { SubscriptionNames } = require('../../../server/infra/RabbitMQ/config');
const { config } = require('./rabbitmq-test-config');
const capture1 = require('../../mock/capture1.json');
const grower_account1 = require('../../mock/grower_account1.json');
const { knex, addCapture } = require('../../utils');

describe('Replay Events API', () => {
  after(async () => {
    await knex('capture').del();
    await knex('domain_event').del();
    await knex('grower_account').del();
  });

  it(`Should handle ${SubscriptionNames.RAW_CAPTURE_REJECTED} event`, async () => {
    const growerAccount = await knex('grower_account')
      .insert({
        ...grower_account1,
        status: 'active',
      })
      .returning('id');
    const [capture1GrowerAccountId] = growerAccount;
    capture1.grower_account_id = capture1GrowerAccountId;
    delete capture1.tree_id;
    await addCapture({
      ...capture1,
      estimated_geometric_location: 'POINT(50 50)',
      updated_at: '2022-02-01 11:11:11',
    });
    const broker = await Broker.create(config);
    const publication = await broker.publish(
      SubscriptionNames.RAW_CAPTURE_REJECTED,
      { id: capture1.id },
    );

    publication
      .on('success', (e) => log.log(`message published successfuly ${e}`))
      .on('error', (err, messageId) => {
        log.error(`Error with id ${messageId} ${err.message}`);
        throw err;
      });

    // wait for the message to be processed
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const noOfDeletedCaptures = await knex('capture')
      .count()
      .where({ id: capture1.id, status: 'deleted' });
    expect(+noOfDeletedCaptures[0].count).to.eql(1);

    const numOfHandledEvents = await knex('domain_event')
      .count()
      .where({ status: 'handled' });
    expect(+numOfHandledEvents[0].count).to.eql(1);

    await broker.unsubscribeAll();
    await broker.purge();
    await broker.shutdown();
  });
});
