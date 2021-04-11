const Session = require('../infra/database/Session');
// const { subscribe } = require('../messaging/RabbitMQMessaging');

const {
  CaptureRepository,
  EventRepository,
} = require('../infra/database/PgRepositories');
const { DomainEvent, receiveEvent } = require('../models/DomainEvent');
const { applyVerification } = require('../models/Capture');

const handleVerifyCaptureProcessed = async (message) => {
  const session = new Session(false);
  const eventRepository = new EventRepository(session);
  const captureRepository = new CaptureRepository(session);
  const receive = receiveEvent(eventRepository);
  const domainEvent = await receive(DomainEvent(message));
  try {
    await session.beginTransaction();
    const handleEvent = applyVerification(captureRepository);
    handleEvent(message);
    await eventRepository.update({ id: domainEvent.id, status: 'handled' });
    await session.commitTransaction();
  } catch (e) {
    await session.rollbackTransaction();
  }
};

const registerEventHandlers = () => {
  //subscribe('admin-verification', handleVerifyCaptureProcessed);
};

module.exports = registerEventHandlers;
