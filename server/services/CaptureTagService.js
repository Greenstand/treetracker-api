const CaptureTag = require('../models/CaptureTag');
const Session = require('../infra/database/Session');

class CaptureTagService {
  constructor() {
    this._session = new Session();
    this._captureTag = new CaptureTag(this._session);
  }

  async getCaptureTags(filter) {
    return this._captureTag.getCaptureTags(filter);
  }

  async addTagsToCapture({ tags, capture_id }) {
    try {
      await this._session.beginTransaction();
      await this._captureTag.addTagsToCapture({
        tags,
        capture_id,
      });
      await this._session.commitTransaction();
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
      throw e;
    }
  }

  async updateCaptureTag(updateObject) {
    try {
      await this._session.beginTransaction();
      const captureTag = await this._captureTag.updateCaptureTag(updateObject);
      await this._session.commitTransaction();
      return captureTag;
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
      throw e;
    }
  }
}

module.exports = CaptureTagService;
