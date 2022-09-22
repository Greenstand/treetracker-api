const Capture = require('../models/Capture');
const Session = require('../infra/database/Session');
const { publishCaptureCreatedMessage } = require('./QueueService');
const LegacyAPI = require('./LegacyAPIService');

class CaptureService {
  constructor() {
    this._session = new Session();
    this._capture = new Capture(this._session);
  }

  async getCaptures(filter, limitOptions) {
    return this._capture.getCaptures(filter, limitOptions);
  }

  async getCapturesCount(filter) {
    return this._capture.getCapturesCount(filter);
  }

  async getCaptureById(captureId) {
    return this._capture.getCaptureById(captureId);
  }

  async createCapture(captureObjectParam) {
    try {
      const captureObject = { ...captureObjectParam };

      await LegacyAPI.approveLegacyTree({
        id: captureObject.reference_id,
        speciesId: captureObject.species_id_int,
        morphology: captureObject.morphology,
        age: captureObject.age,
        captureApprovalTag: captureObject.capture_approval_tag,
        legacyAPIAuthorizationHeader:
          captureObject.legacyAPIAuthorizationHeader,
        organizationId: captureObject.organization_id,
      });

      delete captureObject.species_id_int;
      delete captureObject.capture_approval_tag;
      delete captureObject.legacyAPIAuthorizationHeader;
      delete captureObject.organization_id;
      const age = captureObject.age === 'over_two_years' ? 2 : 0;

      await this._session.beginTransaction();
      const { capture, domainEvent, eventRepo, status } =
        await this._capture.createCapture({ ...captureObject, age });

      await this._session.commitTransaction();

      if (domainEvent) {
        publishCaptureCreatedMessage(eventRepo, domainEvent);
      }

      return { capture, status };
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
      throw e;
    }
  }

  async updateCapture(captureObject) {
    try {
      await this._session.beginTransaction();
      const updatedCapture = await this._capture.updateCapture(captureObject);
      await this._session.commitTransaction();

      return updatedCapture;
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
      throw e;
    }
  }
}

module.exports = CaptureService;
