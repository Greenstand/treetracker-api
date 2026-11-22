const fs = require('fs');
const path = require('path');
function run(db, direction) { return fs.promises.readFile(path.join(__dirname, 'sqls', '20261122110000-grower-organization-transfer-audit-' + direction + '.sql'), 'utf8').then(sql => db.runSql(sql)); }
exports.up = db => run(db, 'up');
exports.down = db => run(db, 'down');
exports._meta = { version: 1 };
