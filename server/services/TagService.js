const Session = require('../models/Session');
const Tag = require('../models/Tag');
const HttpError = require('../utils/HttpError');

class TagService {
  constructor() {
    this._session = new Session();
    this._tag = new Tag(this._session);
  }

  async getTags(filter, limitOptions) {
    return this._tag.getTags(filter, limitOptions);
  }

  async getTagsCount(filter) {
    return this._tag.getTagsCount(filter);
  }

  async getTagById(tagId) {
    return this._tag.getTagById(tagId);
  }

  async createTag(tagToCreate) {
    try {
      const tag = await this._tag.getTags(
        { name: tagToCreate.name },
        undefined,
        true,
      );

      if (tag.length > 0) throw new HttpError(422, 'Tag name already exists');

      await this._session.beginTransaction();

      const createdTag = await this._tag.createTag(tagToCreate);

      await this._session.commitTransaction();

      return createdTag;
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
      throw e;
    }
  }

  async updateTag(object) {
    return this._tag.updateTag({
      ...object,
      updated_at: new Date().toISOString(),
    });
  }
}

module.exports = TagService;
