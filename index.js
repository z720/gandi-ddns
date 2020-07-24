
"use strict";
const request = require('request');

// Get config:
// zoneref: domain
// record to update: subdomain or @ or *
// (should be a A record)
// interval for scanning


const messages = {
	"error_init": "Couldn't initiate process: ",
	"ok": "Start monitoring IP ",
	"dryrun": "Dry Run: current record: "
};

let checkIP = function(domain) {
	gandi.getRecord(function compareIP(err, record) {
		if (config.debug) console.debug('Found ', record.rrset_name, config.domain, record.rrset_values[0]);
		if(err) {
			//Couldn't get current record at Gandi
			console.error(err);
		} else {
			currentIp(function(err, current) {
				let oldip = record.rrset_values[0];
				if (config.debug) console.debug('Current IP:', current.ip);
				if (oldip != current.ip) {
					record.rrset_values[0] = current.ip;
					gandi.updateRecord(record, function(err) {
						if (err) {
							console.error(err);
						} else{
							console.log('Previous IP ', oldip, 'Replaced by', current.ip);
						}
					});
				}
			});
		}
	});
};

// check existing record
let currentIp = function(callback) {
	request.get(config.ipcheck, {json: true}, (err, res, body) => {
		if (err) {
			callback(err, null);
		} else {
			callback(null, { ip: body });
		}
	});
};

let args = require('./args.js');

let config = require("./config.js")(args, process.env);

// Try to get API Key from Environment:
let gandi = require('./gandi.js')(config);

// first check: could we get the record
gandi.getRecord(function(err, record) {
	if(err) {
		console.error(messages.error_init, err);
	} else {
		if (!args.dryRun) {
			console.log(messages.ok, record.rrset_name, config.domain, record.rrset_values[0]);
			checkIP(args.domain);
			// start a loop every {interval} if interval
			if (config.interval > 0) {
				setInterval(checkIP, config.interval * 1000 );
			}
		} else {
			console.log(messages.dryrun, record['rrset_name'], config.domain, record['rrset_values'][0]);
		}
	}
});
