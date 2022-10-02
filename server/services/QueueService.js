const { SubscriptionNames } = require('../infra/RabbitMQ/config');
const DomainEventModel = require('../models/DomainEvent');
const RabbitMQ = require('../infra/RabbitMQ/RabbitMQ');

class QueueService {
  constructor(session) {
    this._session = session;
    this._domainEventModel = new DomainEventModel(session);
    this._rabbitmq = new RabbitMQ();
  }

  async init() {
    await this._rabbitmq.init();
  }

  async tearDown() {
    await this._rabbitmq.teardownBroker();
  }

  subscribeToRawCaptureRejectionEvent(eventHandler) {
    this._rabbitmq.subscribe(
      SubscriptionNames.RAW_CAPTURE_REJECTED,
      eventHandler,
    );
  }

  publishCaptureCreatedMessage(domainEvent) {
    this._rabbitmq.publishMessage(
      SubscriptionNames.CAPTURE_CREATED,
      domainEvent.payload,
      () =>
        this._domainEventModel.update({
          ...domainEvent,
          status: 'sent',
        }),
    );
  }

  publishTreeCreatedMessage(domainEvent) {
    this._rabbitmq.publishMessage(
      SubscriptionNames.TREE_CREATED,
      domainEvent.payload,
      () =>
        this._domainEventModel.update({
          ...domainEvent,
          status: 'sent',
        }),
    );
  }
}

module.exports = QueueService;
