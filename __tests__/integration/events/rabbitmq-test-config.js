const { SubscriptionNames } = require('../../../server/infra/RabbitMQ/config');

module.exports = {
  config: {
    vhosts: {
      dev: {
        connection: {
          url: process.env.RABBIT_MQ_URL,
          socketOptions: {
            timeout: 1000,
          },
        },
        queues: [SubscriptionNames.RAW_CAPTURE_REJECTED],
        publications: {
          [SubscriptionNames.RAW_CAPTURE_REJECTED]: {
            queue: SubscriptionNames.RAW_CAPTURE_REJECTED,
          },
        },
      },
    },
  },
};
