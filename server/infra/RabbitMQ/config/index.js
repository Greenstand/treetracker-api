const SubscriptionNames = {
  CAPTURE_CREATED: 'capture-created',
  TREE_CREATED: 'tree-created',
};

module.exports = {
  SubscriptionNames,
  config: {
    vhosts: {
      dev: {
        connection: {
          url: process.env.RABBIT_MQ_URL,
          socketOptions: {
            timeout: 3000,
          },
        },
        queues: [
          SubscriptionNames.CAPTURE_CREATED,
          SubscriptionNames.TREE_CREATED,
        ],
        publications: {
          [SubscriptionNames.CAPTURE_CREATED]: {
            queue: SubscriptionNames.CAPTURE_CREATED,
          },
          [SubscriptionNames.TREE_CREATED]: {
            queue: SubscriptionNames.TREE_CREATED,
          },
        },
      },
    },
  },
};
