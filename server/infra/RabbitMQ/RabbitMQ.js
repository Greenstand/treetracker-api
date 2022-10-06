const Broker = require('rascal').BrokerAsPromised;
const log = require('loglevel');
const { config } = require('./config');

class RabbitMQ {
  constructor() {
    this.init = async function () {
      this._broker = await Broker.create(config);
    };
  }

  async publishMessage(publicationName, payload, resultHandler) {
    try {
      const publication = await this._broker.publish(publicationName, payload);
      publication.on('success', resultHandler).on('error', (err, messageId) => {
        log.error(`Error with id ${messageId} ${err}`);
      });
    } catch (err) {
      log.error(`Error publishing message ${err}`);
    }
  }

  async subscribe(subscriptionName, eventHandler) {
    try {
      const subscription = await this._broker.subscribe(subscriptionName);
      subscription
        .on('message', (message, content, ackOrNack) => {
          try {
            eventHandler(content);
            ackOrNack();
          } catch (e) {
            log.error(e);
            ackOrNack(e, [
              // republish until attempts limit then dead-letter
              {
                strategy: 'republish',
                defer: 10000,
                attempts: 10,
              },
              {
                strategy: 'nack',
              },
            ]);
          }
        })
        .on('error', log.error);
    } catch (err) {
      log.info(err);
      log.error(
        `Error subscribing to the queue ${subscriptionName}, error: ${err}`,
      );
    }
  }

  async teardownBroker() {
    await this._broker.unsubscribeAll();
    await this._broker.purge();
    await this._broker.shutdown();
  }
}

module.exports = RabbitMQ;
