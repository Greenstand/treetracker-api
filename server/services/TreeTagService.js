const Session = require('../models/Session');
const TreeTag = require('../models/TreeTag');

class TreeTagService {
  constructor() {
    this._session = new Session();
    this._treeTag = new TreeTag(this._session);
  }

  async getTreeTags(filter) {
    return this._treeTag.getTreeTags(filter);
  }

  async addTagsToTree({ tags, tree_id }) {
    try {
      await this._session.beginTransaction();
      await this._treeTag.addTagsToTree({
        tags,
        tree_id,
      });
      await this._session.commitTransaction();
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
      throw e;
    }
  }

  async updateTreeTag(updateObject) {
    try {
      await this._session.beginTransaction();
      const treeTag = this._treeTag.updateTreeTag(updateObject);
      await this._session.commitTransaction();
      return treeTag;
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
      throw e;
    }
  }
}

module.exports = TreeTagService;
