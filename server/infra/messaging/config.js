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
        exchanges: ['capture-data'],
        queues: ['capture-data:events'],
        publications: {
          'capture-created': {
            exchange: 'capture-data',
          },
        },
      },
    },
  },
};
