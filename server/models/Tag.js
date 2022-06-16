const TagRepository = require('../repositories/TagRepository');
const HttpError = require('../utils/HttpError');

class Tag {
  constructor(session) {
    this._tagRepository = new TagRepository(session);
  }

  static Tag({ id, name, isPublic, status, owner_id, created_at, updated_at }) {
    return Object.freeze({
      id,
      name,
      isPublic,
      status,
      owner_id,
      created_at,
      updated_at,
    });
  }

  _response(tag) {
    return this.constructor.Tag(tag);
  }

  async getTags(filter, options, getAll) {
    const tags = await this._tagRepository.getByFilter(
      { ...(!getAll && { status: 'active' }), ...filter },
      options,
    );

    return tags.map((row) => this._response(row));
  }

  async getTagsCount(filter) {
    return this._tagRepository.countByFilter({ ...filter, status: 'active' });
  }

  async getTagById(tagId) {
    const tag = await this._tagRepository.getById(tagId);
    return this._response(tag);
  }

  async createTag(tagToCreate) {
    const tag = await this.getTags(
      { name: tagToCreate.name, owner_id: tagToCreate.owner_id },
      undefined,
      true,
    );
    if (tag.length > 0)
      throw new HttpError(
        422,
        `Tag name "${tagToCreate.name}" already exists for this organization`,
      );

    const createdTag = await this._tagRepository.create(tagToCreate);
    return this._response(createdTag);
  }

  async updateTag(object) {
    const updatedTag = await this._tagRepository.update({
      ...object,
      updated_at: new Date().toISOString(),
    });

    return this._response(updatedTag);
  }
}

module.exports = Tag;
