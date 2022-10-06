const SubscriptionNames = {
  CAPTURE_CREATED: 'capture-created',
  TREE_CREATED: 'tree-created',
  RAW_CAPTURE_REJECTED: 'raw-capture-rejected',
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
          SubscriptionNames.RAW_CAPTURE_REJECTED,
        ],
        publications: {
          [SubscriptionNames.CAPTURE_CREATED]: {
            queue: SubscriptionNames.CAPTURE_CREATED,
          },
          [SubscriptionNames.TREE_CREATED]: {
            queue: SubscriptionNames.TREE_CREATED,
          },
        },
        subscriptions: {
          [SubscriptionNames.RAW_CAPTURE_REJECTED]: {
            queue: SubscriptionNames.RAW_CAPTURE_REJECTED,
            contentType: 'application/json',
          },
        },
      },
    },
  },
};
