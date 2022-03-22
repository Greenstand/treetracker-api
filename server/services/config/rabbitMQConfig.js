module.exports = {
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
          process.env.CAPTURE_CREATED_QUEUE,
          process.env.TREE_CREATED_QUEUE,
        ],
        publications: {
          'capture-created': {
            queue: process.env.CAPTURE_CREATED_QUEUE,
          },
          'tree-created': {
            queue: process.env.TREE_CREATED_QUEUE,
          },
        },
      },
    },
  },
};
