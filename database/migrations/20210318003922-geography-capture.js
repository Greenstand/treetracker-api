let dbm;
let type;
let seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  db.runSql(
    'ALTER TABLE treetracker.capture ADD COLUMN estimated_geographic_location GEOGRAPHY(Point, 4326)',
    callback,
  );
};

exports.down = function (db, callback) {
  db.runSql(
    'ALTER TABLE treetracker.capture DROP COLUMN estimated_geographic_location',
    callback,
  );
};

exports._meta = {
  version: 1,
};
