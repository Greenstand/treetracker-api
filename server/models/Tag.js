const TagRepository = require('../repositories/TagRepository');

class Tag {
  constructor(session) {
    this._tagRepository = new TagRepository(session);
  }

  static Tag({ id, name, isPublic, status, created_at, updated_at }) {
    return Object.freeze({
      id,
      name,
      isPublic,
      status,
      created_at,
      updated_at,
    });
  }

  async getTags(filter, options, getAll) {
    const tags = await this._tagRepository.getByFilter(
      { ...(!getAll && { status: 'active' }), ...filter },
      options,
    );

    return tags.map((row) => this.constructor.Tag(row));
  }

  async getTagsCount(filter) {
    return this._tagRepository.countByFilter(filter);
  }

  async getTagById(tagId) {
    const tag = await this._tagRepository.getById(tagId);
    return this.constructor.Tag(tag);
  }

  async createTag(tagToCreate) {
    return this._tagRepository.create(tagToCreate);
  }

  async updateTag(object) {
    return this._tagRepository.update(object);
  }
}

module.exports = Tag;
