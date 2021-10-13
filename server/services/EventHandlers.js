const Session = require('../infra/database/Session');
// const { subscribe } = require('../messaging/RabbitMQMessaging');

const EventRepository = require('../infra/database/EventRepository');
const CaptureRepository = require('../infra/database/CaptureRepository');

const { DomainEvent, receiveEvent } = require('../models/DomainEvent');
const { applyVerification } = require('../models/Capture');

const registerEventHandlers = () => {
  // subscribe('admin-verification', handleVerifyCaptureProcessed);
};

module.exports = registerEventHandlers;
