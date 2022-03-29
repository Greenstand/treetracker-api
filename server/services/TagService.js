const Session = require('../database/Session');
const Tag = require('../models/Tag');

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
    try {
      await this._session.beginTransaction();
      const updatedTag = await this._tag.updateTag(object);
      await this._session.commitTransaction();

      return updatedTag;
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
      throw e;
    }
  }
}

module.exports = TagService;
