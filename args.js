"use strict";

module.exports = require("yargs")
		.usage("$0 --config=file <domain> [record]")
		.env("GANDI")
		.option('config', {
				demandOption: false,
				describe: 'Override config file name and path'
		})
		.option('api-key', {
				demandOption: false,
				alias: 'api_key',
				describe: 'Your GANDI api key. Can be set through environment variable GANDI_API_KEY Env'
		})
		.option('dry-run', {
				describe: 'No update is actually made to the DNS record. Show current value.'
		})
		.help()
		.command('* <domain> <record>', 'Update <record> for a specific <domain> with current IP address', (yargs) => {
			yargs.positional('domain', {
				describe: 'The root domain to update records (example.com)',
				type: 'String'
			}).positional('record',{
				describe: "Record to update with current IP (www)",
			} )
		})
		.argv
