const BaseRepository = require('./BaseRepository');

class GrowerAccountRepository extends BaseRepository {
  constructor(session) {
    super('grower_account', session);
    this._tableName = 'grower_account';
    this._session = session;
  }

  async getByFilter(filter, options) {
    const whereBuilder = function (object, builder) {
      const result = builder;

      const filterObject = { ...object };

      if (filterObject.organization_id) {
        filterObject['grower_account_org.organization_id'] =
          filterObject.organization_id;
      }

      const { getAll } = filterObject;
      delete filterObject.organization_id;
      delete filterObject.getAll;

      result.where(filterObject);

      if (!getAll) {
        result.andWhere('grower_account.status', 'active');
      }
    };

    const knex = this._session.getDB();

    let promise = knex
      .select(
        'grower_account.id',
        'grower_account.reference_id',
        'grower_account.show_in_map',
        'grower_account.wallet',
        'grower_account.person_id',
        'grower_account.organization_id',
        'grower_account.first_name',
        'grower_account.last_name',
        'grower_account.email',
        'grower_account.phone',
        'grower_account.about',
        'grower_account.lat',
        'grower_account.lon',
        'grower_account.location',
        'grower_account.image_url',
        'grower_account.image_rotation',
        'grower_account.status',
        'grower_account.first_registration_at',
        'grower_account.gender',
        'grower_account.bulk_pack_file_name',
        'grower_account.created_at',
        'grower_account.updated_at',
        knex.raw(
          `json_agg(grower_account_org.organization_id) as organizations`,
        ),
        knex.raw(
          `COALESCE(
            json_agg(
              json_build_object('id', grower_account_image.id, 'image_url', grower_account_image.image_url)
            ) FILTER ( WHERE grower_account_image.image_url IS NOT NULL ), '[]'
          ) as images`,
        ),
      )
      .table(this._tableName)
      .leftJoin(
        'grower_account_org',
        `${this._tableName}.id`,
        '=',
        'grower_account_org.grower_account_id',
      )
      .leftJoin('grower_account_image', function () {
        this.on(
          `grower_account.id`,
          '=',
          'grower_account_image.grower_account_id',
        ).on('grower_account_image.active', '=', knex.raw('?', [true]));
      })
      .groupBy('grower_account.id')
      .where((builder) => whereBuilder(filter, builder));

    if (options && options.limit) {
      promise = promise.limit(options && options.limit);
    }
    if (options && options.offset) {
      promise = promise.offset(options && options.offset);
    }
    const result = await promise;
    return result;
  }

  async updateInfo(object) {
    const result = await this._session
      .getDB()(this._tableName)
      .update(object)
      .where('wallet', object.wallet)
      .returning('*');
    return result[0];
  }
}

module.exports = GrowerAccountRepository;
