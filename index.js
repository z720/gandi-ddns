
"use strict";
const fs = require('fs');
// Get config:
// zoneref: domain
// record to update: subdomain or @ or *
// (should be a A record)
// interval for scanning

const messages = {
	"error_init": "Couldn't initiate process: ",
	"ok": "Start monitoring IP ",
	"dryrun": "Dry Run: current record: ",
	'noip': "Couldn't get current ip: no update"
};
 
const status = {
	lastSuccess: undefined,
	lastError: undefined,
	lastChange: undefined,
	interval: undefined,
	errorCount: 0
}

function updateStatus() {
	fs.writeFile('status.json', JSON.stringify(status), function(err) {
		if(err){
			console.error('status save', err);
			//die?
		}
	});
}

function error(type, reason) {
	console.error('Error', type, reason);
	status.lastError = Date.now();
	status.errorCount += 1;
	updateStatus();
}

function success(change, msg) {
	status.errorCount = 0;
	status.lastSuccess = Date.now();
	if(change) {
		status.lastChange = Date.now();
	}
	if(msg) {
		console.log(msg);
	}
	updateStatus();
}

let checkIP = function(domain) {
	gandi.getRecord(function compareIP(err, record) {
		if (config.debug) console.debug('Found ', record.rrset_name, config.domain, record.rrset_values[0]);
		if(err) {
			//Couldn't get current record at Gandi
			error('Gandi records', err);
		} else {
			currentIp(function(err, current) {
				let oldip = record.rrset_values[0];
				if (err || (current.ip == null)) {
					// Impossible to get current ip
					error('Current IP', err);
				} else {
					if (config.debug) console.debug('Current IP:', current.ip);
					if (oldip != current.ip) {
						record.rrset_values[0] = current.ip;
						gandi.updateRecord(record, function(err) {
							if (err) {
								error('Gandi Update', err);
							} else{
								success(true, 'Previous IP ' + oldip + ' Replaced by ' + current.ip);
							}
						});
					} else {
						success(false);
					}
				}
			});
		}
	});
};


let args = require('./lib/args.js');

let config = require("./lib/config.js")(args, process.env);
status.interval = config.interval;

// Try to get API Key from Environment:
let gandi = require('./lib/gandi.js')(config);

const currentIp = require('./lib/currentip')(config.ipcheck, config.timeout, config.debug);

// first check: could we get the record
gandi.getRecord(function(err, record) {
	if(err) {
		error(messages.error_init, err);
	} else {
		if (!args.dryRun) {
			console.log(messages.ok, record.rrset_name, config.domain, record.rrset_values[0]);
			checkIP(args.domain);
			// start a loop every {interval} if interval
			if (config.interval > 0) {
				setInterval(checkIP, config.interval * 1000 );
			}
		} else {
			console.log(messages.dryrun, record.rrset_name, config.domain, record.rrset_values[0]);
		}
	}
});
