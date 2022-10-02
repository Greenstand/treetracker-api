/**
 * Contains functions used to process various incoming events subscribed in the application
 * and update the status of the domain event.
 */
const log = require('loglevel');
const Session = require('../infra/database/Session');
const DomainEvent = require('../models/DomainEvent');
const Capture = require('../models/Capture');
const QueueService = require('./QueueService');
const { DomainEventTypes } = require('../utils/enums');

const DictEventHandlers = Object.freeze({
  RawCaptureRejected: async (payload, session) => {
    const capture = new Capture(session);
    await capture.updateCapture({ id: payload.id, status: 'deleted' });
  },
});

class EventHandlerService {
  constructor() {
    this._session = new Session();
  }

  async registerEventHandlers() {
    const queueService = new QueueService();
    await queueService.init();
    queueService.subscribeToRawCaptureRejectionEvent((message) =>
      this.processMessage(DictEventHandlers.RawCaptureRejected, {
        ...message,
        type: DomainEventTypes.RawCaptureRejected,
      }),
    );
  }

  async applyEventHandler(eventHandler, domainEvent) {
    const domainEventModel = new DomainEvent(this._session);
    try {
      await this._session.beginTransaction();
      await eventHandler(domainEvent.payload, this._session);
      await domainEventModel.update({ id: domainEvent.id, status: 'handled' });
      await this._session.commitTransaction();
    } catch (e) {
      log.error(e);
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
    }
  }

  async processMessage(eventHandler, message) {
    const domainEventModel = new DomainEvent(this._session);
    const domainEvent = await domainEventModel.receiveEvent(message);
    this.applyEventHandler(eventHandler, domainEvent);
  }
}

module.exports = { EventHandlerService, DictEventHandlers };
