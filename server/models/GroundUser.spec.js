const { expect } = require('chai');
const sinon = require('sinon');
const { getGroundUsers, GroundUser } = require('./GroundUser');

describe('GroundUser Model', () => {
  it('GroundUser Model should return defined fields', () => {
    const groundUser = GroundUser({});
    expect(groundUser).to.have.keys([
      'id',
      'first_name',
      'last_name',
      'email',
      'organization',
      'phone',
      'pwd_reset_required',
      'image_url',
      'person_id',
      'organization_id',
      'image_rotation',
    ]);
  });

  describe('getGroundUsers', () => {
    it('should get groundUsers with organization_id', async () => {
      const getByFilter = sinon.mock();
      const getGroundUsersByOrganization = sinon.mock();
      const executeGetGroundUsers = getGroundUsers({
        getByFilter,
        getGroundUsersByOrganization,
      });
      getGroundUsersByOrganization.resolves([{ id: 1 }]);
      const result = await executeGetGroundUsers({ organization_id: 'uuid' });
      expect(getByFilter.notCalled);
      expect(getGroundUsersByOrganization.calledWith('uuid', {})).to.be.true;
      expect(result.ground_users).to.have.length(1);
      expect(result.links).to.have.keys(['prev', 'next']);
      expect(result.ground_users[0]).property('id').eq(1);
    });

    it('should get groundUsers with organization_id -- with limit', async () => {
      const getByFilter = sinon.mock();
      const getGroundUsersByOrganization = sinon.mock();
      const executeGetGroundUsers = getGroundUsers({
        getByFilter,
        getGroundUsersByOrganization,
      });
      getGroundUsersByOrganization.resolves([{ id: 1 }]);
      const result = await executeGetGroundUsers({
        organization_id: 'uuid',
        limit: 2,
      });
      expect(getByFilter.notCalled);
      expect(getGroundUsersByOrganization.calledWith('uuid', { limit: 2 })).to
        .be.true;
      expect(result.ground_users).to.have.length(1);
      expect(result.links).to.have.keys(['prev', 'next']);
      expect(result.ground_users[0]).property('id').eq(1);
    });

    it('should get groundUsers with organization_id -- with offset', async () => {
      const getByFilter = sinon.mock();
      const getGroundUsersByOrganization = sinon.mock();
      const executeGetGroundUsers = getGroundUsers({
        getByFilter,
        getGroundUsersByOrganization,
      });
      getGroundUsersByOrganization.resolves([{ id: 1 }]);
      const result = await executeGetGroundUsers({
        organization_id: 'uuid',
        offset: 2,
      });
      expect(getByFilter.notCalled);
      expect(getGroundUsersByOrganization.calledWith('uuid', {})).to.be.true;
      expect(result.ground_users).to.have.length(1);
      expect(result.links).to.have.keys(['prev', 'next']);
      expect(result.ground_users[0]).property('id').eq(1);
    });

    it('should get groundUsers with organization_id -- with limit and offset', async () => {
      const getByFilter = sinon.mock();
      const getGroundUsersByOrganization = sinon.mock();
      const executeGetGroundUsers = getGroundUsers({
        getByFilter,
        getGroundUsersByOrganization,
      });
      getGroundUsersByOrganization.resolves([{ id: 1 }]);
      const result = await executeGetGroundUsers({
        organization_id: 'uuid',
        offset: 2,
        limit: 4,
      });
      expect(getByFilter.notCalled);
      expect(
        getGroundUsersByOrganization.calledWith('uuid', {
          limit: 4,
          offset: 2,
        }),
      ).to.be.true;
      expect(result.ground_users).to.have.length(1);
      expect(result.links).to.have.keys(['prev', 'next']);
      expect(result.ground_users[0]).property('id').eq(1);
    });

    it('should get groundUsers without organization_id', async () => {
      const getByFilter = sinon.mock();
      const getGroundUsersByOrganization = sinon.mock();
      const executeGetGroundUsers = getGroundUsers({
        getByFilter,
        getGroundUsersByOrganization,
      });
      getByFilter.resolves([{ id: 1 }]);
      const result = await executeGetGroundUsers();
      expect(getGroundUsersByOrganization.notCalled);
      expect(getByFilter.calledWith({}, { limit: 100, offset: 0 })).to.be.true;
      expect(result.ground_users).to.have.length(1);
      expect(result.links).to.have.keys(['prev', 'next']);
      expect(result.ground_users[0]).property('id').eq(1);
    });

    it('should get groundUsers without organization_id -- with limit', async () => {
      const getByFilter = sinon.mock();
      const getGroundUsersByOrganization = sinon.mock();
      const executeGetGroundUsers = getGroundUsers({
        getByFilter,
        getGroundUsersByOrganization,
      });
      getByFilter.resolves([{ id: 1 }]);
      const result = await executeGetGroundUsers({ limit: 2 });
      expect(getGroundUsersByOrganization.notCalled);
      expect(getByFilter.calledWith({}, { limit: 2 })).to.be.true;
      expect(result.ground_users).to.have.length(1);
      expect(result.links).to.have.keys(['prev', 'next']);
      expect(result.ground_users[0]).property('id').eq(1);
    });

    it('should get groundUsers without organization_id -- with offset', async () => {
      const getByFilter = sinon.mock();
      const getGroundUsersByOrganization = sinon.mock();
      const executeGetGroundUsers = getGroundUsers({
        getByFilter,
        getGroundUsersByOrganization,
      });
      getByFilter.resolves([{ id: 1 }]);
      const result = await executeGetGroundUsers({ offset: 2 });
      expect(getGroundUsersByOrganization.notCalled);
      expect(getByFilter.calledWith({}, { limit: 100, offset: 0 })).to.be.true;
      expect(result.ground_users).to.have.length(1);
      expect(result.links).to.have.keys(['prev', 'next']);
      expect(result.ground_users[0]).property('id').eq(1);
    });

    it('should get groundUsers without organization_id -- with limit and offset', async () => {
      const getByFilter = sinon.mock();
      const getGroundUsersByOrganization = sinon.mock();
      const executeGetGroundUsers = getGroundUsers({
        getByFilter,
        getGroundUsersByOrganization,
      });
      getByFilter.resolves([{ id: 1 }]);
      const result = await executeGetGroundUsers({ limit: 4, offset: 2 });
      expect(getGroundUsersByOrganization.notCalled);
      expect(getByFilter.calledWith({}, { limit: 4, offset: 2 })).to.be.true;
      expect(result.ground_users).to.have.length(1);
      expect(result.links).to.have.keys(['prev', 'next']);
      expect(result.ground_users[0]).property('id').eq(1);
    });
  });
});
