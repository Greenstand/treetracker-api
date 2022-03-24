const CaptureTagRepository = require('../repositories/CaptureTagRepository');
const HttpError = require('../utils/HttpError');

class CaptureTag {
  constructor(session) {
    this._captureTagRepository = new CaptureTagRepository(session);
  }

  static CaptureTag({
    id,
    capture_id,
    tag_id,
    tag_name,
    status,
    created_at,
    updated_at,
  }) {
    return Object.freeze({
      id,
      capture_id,
      tag_id,
      tag_name,
      status,
      created_at,
      updated_at,
    });
  }

  async getCaptureTags(filter) {
    const captureTags = await this._captureTagRepository.getCaptureTags({
      ...filter,
    });

    return captureTags.map((row) => this.constructor.CaptureTag(row));
  }

  async addTagsToCapture({ tags, capture_id }) {
    const insertObjectArray = await Promise.all(
      tags.map(async (t) => {
        const captureTag = await this._captureTagRepository.getCaptureTags({
          tag_id: t,
          capture_id,
        });
        if (captureTag.length > 0)
          throw new HttpError(
            400,
            `Tag ${t} has already been assigned to the specified capture`,
          );
        return { tag_id: t, capture_id };
      }),
    );

    await this._captureTagRepository.create(insertObjectArray);
  }

  async updateCaptureTag(updateObject) {
    const captureTag = await this._captureTagRepository.update({
      ...updateObject,
      updated_at: new Date().toISOString(),
    });

    return this.constructor.CaptureTag(captureTag);
  }
}

module.exports = CaptureTag;
