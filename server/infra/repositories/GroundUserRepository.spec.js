const { expect } = require('chai');
const mockKnex = require('mock-knex');
const knex = require('knex');
const GroundUserRepository = require('./GroundUserRepository');

const tracker = mockKnex.getTracker();
const Session = require('../database/Session');

describe('GroundUserRepository', () => {
  let groundUserRepository;
  const knexDB = knex({ client: 'pg' });

  beforeEach(() => {
    mockKnex.mock(knexDB);
    tracker.install();
    const session = new Session();
    groundUserRepository = new GroundUserRepository(session);
  });

  afterEach(() => {
    tracker.uninstall();
    mockKnex.unmock(knexDB);
  });

  it('getGroundUsersByOrganization', async () => {
    tracker.uninstall();
    tracker.install();
    tracker.on('query', (query) => {
      expect(query.sql).match(
        /.*planter.*.*planter.organization_id.*.*entity\.id.*.*stakeholder_uuid.*/,
      );

      query.response({ rows: [{ id: 1 }] });
    });
    const result = await groundUserRepository.getGroundUsersByOrganization(1);
    expect(result[0]).property('id').eq(1);
  });

  it('getGroundUsersByOrganization with LIMIT', async () => {
    tracker.uninstall();
    tracker.install();
    tracker.on('query', (query) => {
      expect(query.sql).match(
        /.*planter.*.*planter.organization_id.*.*entity\.id.*.*stakeholder_uuid.*\s*LIMIT.*/,
      );
      query.response({ rows: [{ id: 1 }] });
    });
    const result = await groundUserRepository.getGroundUsersByOrganization(1, {
      limit: 1,
    });
    expect(result[0]).property('id').eq(1);
  });

  it('getGroundUsersByOrganization with OFFSET', async () => {
    tracker.uninstall();
    tracker.install();
    tracker.on('query', (query) => {
      expect(query.sql).match(
        /.*planter.*.*planter.organization_id.*.*entity\.id.*.*stakeholder_uuid.*\s*OFFSET.*/,
      );
      query.response({ rows: [{ id: 1 }] });
    });
    const result = await groundUserRepository.getGroundUsersByOrganization(1, {
      offset: 1,
    });
    expect(result[0]).property('id').eq(1);
  });
});
