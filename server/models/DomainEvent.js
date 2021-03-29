const { v4: uuid } = require('uuid');
const { Repository } = require('./Repository');

const DomainEvent = (payload) =>
  Object.freeze({
    id: uuid(),
    payload,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

const raiseEvent = (eventRepositoryImpl) => async (domainEvent) => {
  const eventRepository = new Repository(eventRepositoryImpl);
  return await eventRepository.add({ ...domainEvent, status: 'raised' });
};

const receiveEvent = (eventRepositoryImpl) => async (domainEvent) => {
  const eventRepository = new Repository(eventRepositoryImpl);
  return await eventRepository.add({ ...domainEvent, status: 'received' });
};

const dispatch = (eventRepositoryImpl, publishToTopic) => async (
  domainEvent,
) => {
  publishToTopic(domainEvent.payload, () => {
    eventRepositoryImpl.update({
      ...domainEvent,
      status: 'sent',
      updated_at: new Date().toISOString(),
    });
  });
};

module.exports = { DomainEvent, raiseEvent, receiveEvent, dispatch };
