const { SubscriptionNames } = require('../infra/RabbitMQ/config');
const { dispatch } = require('../models/DomainEvent');
const { publishMessage } = require('../infra/RabbitMQ/RabbitMQ');

const publishCaptureCreatedMessage = (eventRepo, domainEvent) => {
  const eventDispatch = dispatch(eventRepo, publishMessage);
  eventDispatch(SubscriptionNames.CAPTURE_CREATED, domainEvent);
};

const publishTreeCreatedMessage = (eventRepo, domainEvent) => {
  const eventDispatch = dispatch(eventRepo, publishMessage);
  eventDispatch(SubscriptionNames.TREE_CREATED, domainEvent);
};

module.exports = { publishCaptureCreatedMessage, publishTreeCreatedMessage };
