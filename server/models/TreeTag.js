const TreeTagRepository = require('../repositories/TreeTagRepository');
const HttpError = require('../utils/HttpError');

class TreeTag {
  constructor(session) {
    this._treeTagRepository = TreeTagRepository(session);
  }

  static TreeTag({
    id,
    tree_id,
    tag_id,
    tag_name,
    status,
    created_at,
    updated_at,
  }) {
    return Object.freeze({
      id,
      tree_id,
      tag_id,
      tag_name,
      status,
      created_at,
      updated_at,
    });
  }

  async getTreeTags(filter) {
    const treeTags = await this._treeTagRepository.getTreeTags({
      ...filter,
    });

    return treeTags.map((row) => this.constructor.TreeTag(row));
  }

  async addTagsToTree({ tags, tree_id }) {
    const insertObjectArray = await Promise.all(
      tags.map(async (t) => {
        const treeTag = await this._treeTagRepository.getTreeTags({
          tag_id: t,
          tree_id,
        });
        if (treeTag.length > 0)
          throw new HttpError(
            400,
            `Tag ${t} has already been assigned to the specified tree`,
          );
        return { tag_id: t, tree_id };
      }),
    );

    await this._treeTagRepository.create(insertObjectArray);
  }

  async updateTreeTag(updateObject) {
    const treeTag = await this._treeTagRepository.update({
      ...updateObject,
      updated_at: new Date().toISOString(),
    });

    return this.constructor.TreeTag(treeTag);
  }
}

module.exports = TreeTag;
