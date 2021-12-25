const BaseRepository = require('./BaseRepository');

class TreeTagRepository extends BaseRepository {
  constructor(session) {
    super('tree_tag', session);
    this._tableName = 'tree_tag';
    this._session = session;
  }

  async getTreeTags(filter) {
    const whereBuilder = function (object, builder) {
      const result = builder;
      result.where(object);

      return result;
    };

    return this._session
      .getDB()
      .select(
        'tree_tag.id as id',
        'tree.id as tree_id',
        'tag.id as tag_id',
        'tag.name as tag_name',
        'tree_tag.status as status',
        'tree_tag.created_at',
        'tree_tag.updated_at',
      )
      .table(this._tableName)
      .join('tree', 'tree_tag.tree_id', 'tree.id')
      .join('tag', 'tree_tag.tag_id', 'tag.id')
      .where((builder) => whereBuilder(filter, builder));
  }

  async update(object) {
    return this._session
      .getDB()(this._tableName)
      .update(object)
      .where({ tree_id: object.tree_id, tag_id: object.tag_id });
  }

  async delete(object) {
    return this._session
      .getDB()(this._tableName)
      .where({ tree_id: object.tree_id, tag_id: object.tag_id })
      .del();
  }
}

module.exports = TreeTagRepository;
