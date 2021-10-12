const Session = require('../infra/database/Session');
// const { subscribe } = require('../messaging/RabbitMQMessaging');

const {
  CaptureRepository,
  EventRepository,
} = require('../infra/database/PgRepositories');
const { DomainEvent, receiveEvent } = require('../models/DomainEvent');
const { applyVerification } = require('../models/Capture');

const registerEventHandlers = () => {
  // subscribe('admin-verification', handleVerifyCaptureProcessed);
};

module.exports = registerEventHandlers;
