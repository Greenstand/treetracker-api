const { v4: uuid } = require('uuid');

const DomainEvent = (payload) =>
  Object.freeze({
    id: uuid(),
    payload,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

const raiseEvent = (eventRepository) => async (domainEvent) => {
  return eventRepository.create({ ...domainEvent, status: 'raised' });
};

const receiveEvent = (eventRepository) => async (domainEvent) => {
  return eventRepository.create({ ...domainEvent, status: 'received' });
};

const dispatch =
  (eventRepositoryImpl, publishToTopic) =>
  async (publicationName, domainEvent) => {
    publishToTopic(publicationName, domainEvent.payload, () => {
      eventRepositoryImpl.update({
        ...domainEvent,
        status: 'sent',
        updated_at: new Date().toISOString(),
      });
    });
  };

module.exports = { DomainEvent, raiseEvent, receiveEvent, dispatch };
