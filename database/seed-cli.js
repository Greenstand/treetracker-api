const log = require("loglevel");
const { Command } = require('commander');
const seed = require('./seeds/seed');

const program = new Command();

program
  .name('seed-cli')
  .description('CLI to seed data into DB for testing')
  .version('0.1.0');

program.command('create-capture')
  .description('Create new capture')
  // .argument('<string>', 'string to split')
  .requiredOption('-d, --date <string>', 'the date of the capture created')
  .action((options) => {
    // const limit = options.first ? 1 : undefined;
    // console.log(str.split(options.separator, limit));
    log.warn("seeding...", options);
    seed.createCapture(
      options.date,
    )
      .then(() => {
        log.warn("done!");
        process.exit(0);
      }).catch(e => {
        log.error("error", e);
        log.warn("seed failed!");
        process.exit(1);
      })
    log.warn("executed...");
  });

program.parse();