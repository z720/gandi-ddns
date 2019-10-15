function positional(args) {
  // Positional args node index.js example.com  ddns
  if (args._[1] && !args.record) {
    args.record = args._[1];
  }
  if (args._[0] && !args.domain) {
    args.domain = args._[0];
  }
}

module.exports = require("yargs")
    .usage("$0 --config=file <domain> [record]")
    .env("GANDI")
    .option('config', {
        demandOption: false,
        default: './config.json',
        describe: 'Override config file name and path'
    })
    .option('api-key', {
        demandOption: true,
        alias: 'api_key',
        describe: 'Your GANDI api key. Can be set through envrionement variable GANDI_API_KEY Env'
    })
    .option('dry-run', {
        describe: 'No update is actually made to the DNS record. Show current value.'
    })
    .middleware(positional)
    .help()
    .argv
