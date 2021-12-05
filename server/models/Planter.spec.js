const { expect } = require('chai');
const sinon = require('sinon');
const { getPlanters, QueryOptions, Planter } = require('./Planter');

describe('Planter Model', () => {
  it('Planter Model should return defined fields', () => {
    const planter = Planter({});
    expect(planter).to.have.keys([
      'id',
      'first_name',
      'last_name',
      'email',
      'organization',
      'phone',
      'pwd_reset_required',
      'image_url',
      'person_id',
      'ordanization_id',
      'image_rotation',
    ]);
  });

  describe('QueryOptions', () => {
    it('QueryOptions should not return results other than limit, offset', () => {
      const filter = QueryOptions({ check: true });
      expect(filter).to.be.empty;
    });

    it('QueryOptions should not return undefined fields', () => {
      const filter = QueryOptions({
        limit: undefined,
        offset: undefined,
      });
      expect(filter).to.be.empty;
    });

    it('QueryOptions should limit, offset', () => {
      const filter = QueryOptions({
        limit: 12,
        offset: 4,
        org: 'undefined',
      });
      expect(filter).to.have.keys(['limit', 'offset']);
    });
  });

  describe('getPlanters', () => {
    it('should get planters with organization_id', async () => {
      const getByFilter = sinon.mock();
      const getPlantersByOrganization = sinon.mock();
      const executeGetPlanters = getPlanters({
        getByFilter,
        getPlantersByOrganization,
      });
      getPlantersByOrganization.resolves([{ id: 1 }]);
      const result = await executeGetPlanters({ organization_id: 'uuid' });
      expect(getByFilter.notCalled);
      expect(getPlantersByOrganization.calledWith('uuid', {})).to.be.true;
      expect(result.planters).to.have.length(1);
      expect(result.links).to.have.keys(['prev', 'next']);
      expect(result.planters[0]).property('id').eq(1);
    });

    it('should get planters with organization_id -- with limit', async () => {
      const getByFilter = sinon.mock();
      const getPlantersByOrganization = sinon.mock();
      const executeGetPlanters = getPlanters({
        getByFilter,
        getPlantersByOrganization,
      });
      getPlantersByOrganization.resolves([{ id: 1 }]);
      const result = await executeGetPlanters({
        organization_id: 'uuid',
        limit: 2,
      });
      expect(getByFilter.notCalled);
      expect(getPlantersByOrganization.calledWith('uuid', { limit: 2 })).to.be
        .true;
      expect(result.planters).to.have.length(1);
      expect(result.links).to.have.keys(['prev', 'next']);
      expect(result.planters[0]).property('id').eq(1);
    });

    it('should get planters with organization_id -- with offset', async () => {
      const getByFilter = sinon.mock();
      const getPlantersByOrganization = sinon.mock();
      const executeGetPlanters = getPlanters({
        getByFilter,
        getPlantersByOrganization,
      });
      getPlantersByOrganization.resolves([{ id: 1 }]);
      const result = await executeGetPlanters({
        organization_id: 'uuid',
        offset: 2,
      });
      expect(getByFilter.notCalled);
      expect(getPlantersByOrganization.calledWith('uuid', {})).to.be.true;
      expect(result.planters).to.have.length(1);
      expect(result.links).to.have.keys(['prev', 'next']);
      expect(result.planters[0]).property('id').eq(1);
    });

    it('should get planters with organization_id -- with limit and offset', async () => {
      const getByFilter = sinon.mock();
      const getPlantersByOrganization = sinon.mock();
      const executeGetPlanters = getPlanters({
        getByFilter,
        getPlantersByOrganization,
      });
      getPlantersByOrganization.resolves([{ id: 1 }]);
      const result = await executeGetPlanters({
        organization_id: 'uuid',
        offset: 2,
        limit: 4,
      });
      expect(getByFilter.notCalled);
      expect(
        getPlantersByOrganization.calledWith('uuid', { limit: 4, offset: 2 }),
      ).to.be.true;
      expect(result.planters).to.have.length(1);
      expect(result.links).to.have.keys(['prev', 'next']);
      expect(result.planters[0]).property('id').eq(1);
    });

    it('should get planters without organization_id', async () => {
      const getByFilter = sinon.mock();
      const getPlantersByOrganization = sinon.mock();
      const executeGetPlanters = getPlanters({
        getByFilter,
        getPlantersByOrganization,
      });
      getByFilter.resolves([{ id: 1 }]);
      const result = await executeGetPlanters();
      expect(getPlantersByOrganization.notCalled);
      expect(getByFilter.calledWith({}, { limit: 100, offset: 0 })).to.be.true;
      expect(result.planters).to.have.length(1);
      expect(result.links).to.have.keys(['prev', 'next']);
      expect(result.planters[0]).property('id').eq(1);
    });

    it('should get planters without organization_id -- with limit', async () => {
      const getByFilter = sinon.mock();
      const getPlantersByOrganization = sinon.mock();
      const executeGetPlanters = getPlanters({
        getByFilter,
        getPlantersByOrganization,
      });
      getByFilter.resolves([{ id: 1 }]);
      const result = await executeGetPlanters({ limit: 2 });
      expect(getPlantersByOrganization.notCalled);
      expect(getByFilter.calledWith({}, { limit: 2 })).to.be.true;
      expect(result.planters).to.have.length(1);
      expect(result.links).to.have.keys(['prev', 'next']);
      expect(result.planters[0]).property('id').eq(1);
    });

    it('should get planters without organization_id -- with offset', async () => {
      const getByFilter = sinon.mock();
      const getPlantersByOrganization = sinon.mock();
      const executeGetPlanters = getPlanters({
        getByFilter,
        getPlantersByOrganization,
      });
      getByFilter.resolves([{ id: 1 }]);
      const result = await executeGetPlanters({ offset: 2 });
      expect(getPlantersByOrganization.notCalled);
      expect(getByFilter.calledWith({}, { limit: 100, offset: 0 })).to.be.true;
      expect(result.planters).to.have.length(1);
      expect(result.links).to.have.keys(['prev', 'next']);
      expect(result.planters[0]).property('id').eq(1);
    });

    it('should get planters without organization_id -- with limit and offset', async () => {
      const getByFilter = sinon.mock();
      const getPlantersByOrganization = sinon.mock();
      const executeGetPlanters = getPlanters({
        getByFilter,
        getPlantersByOrganization,
      });
      getByFilter.resolves([{ id: 1 }]);
      const result = await executeGetPlanters({ limit: 4, offset: 2 });
      expect(getPlantersByOrganization.notCalled);
      expect(getByFilter.calledWith({}, { limit: 4, offset: 2 })).to.be.true;
      expect(result.planters).to.have.length(1);
      expect(result.links).to.have.keys(['prev', 'next']);
      expect(result.planters[0]).property('id').eq(1);
    });
  });
});
