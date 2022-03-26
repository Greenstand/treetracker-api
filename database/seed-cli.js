const log = require("loglevel");
const { Command } = require('commander');
const seed = require('./seeds/seed');

const program = new Command();

program
  .name('seed-cli')
  .description('CLI to seed data into DB for testing')
  .version('0.1.0');

function exec(promise) {
  promise.then(() => {
    log.warn("done!");
    process.exit(0);
  }).catch(e => {
    log.error("error", e);
    log.warn("seed failed!");
    process.exit(1);
  })
  log.warn("executed...");
}

program.command('create-capture')
  .description('Create new capture')
  // .argument('<string>', 'string to split')
  .requiredOption('-d, --date <string>', 'the date of the capture created')
  .requiredOption('-o, --organization <string>', 'the organization id of the capture')
  .requiredOption('-l, --lat <string>', 'the latitude of the capture')
  .requiredOption('-n, --lon <string>', 'the longitude of the capture')
  .requiredOption('-g, --grower <string>', 'the grower id for this capture')
  .action((options) => {
    // const limit = options.first ? 1 : undefined;
    // console.log(str.split(options.separator, limit));
    log.warn("seeding...", options);
    exec(
      seed.createCapture(
        options.date,
        options.organization,
        options.lat,
        options.lon,
        options.grower,
      )
    );
  });

program.command('create-tree')
  .description('Create new tree from a capture')
  .requiredOption('-c, --capture <string>', 'the capture id for the tree')
  .action((options) => {
    exec(
      seed.createTree(
        options.capture,
      )
    );
  });

program.parse();