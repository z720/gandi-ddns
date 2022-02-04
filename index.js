#!/usr/bin/env node
"use strict";
const status = require('./lib/status.js'); 
// Get config:
// zoneref: domain
// record to update: subdomain or @ or *
// (should be a A record)
// interval for scanning

const messages = {
	"error_init": "Couldn't initiate process: ",
	"ok": "Start monitoring IP ",
	"dryrun": "Dry Run: current record: ",
	"noip": "Couldn't get current ip: no update",
	"currentIP": "Current IP"
};
 
let checkIP = function() {
	gandi.getRecord(function compareIP(err, record) {
		if (config.debug) console.debug('Found ', record.rrset_name, config.domain, record.rrset_values[0]);
		if(err) {
			//Couldn't get current record at Gandi
			status.error('Gandi records', err);
		} else {
			currentIp(function(err, current) {
				let oldip = record.rrset_values[0];
				if (err || (current.ip == null)) {
					// Impossible to get current ip0
					status.error('Current IP', err);
				} else {
					if (config.debug) console.debug('Current IP:', current.ip);
					if (oldip != current.ip) {
						record.rrset_values[0] = current.ip;
						gandi.updateRecord(record, function(err) {
							if (err) {
								status.error('Gandi Update', err);
							} else{
								status.success(true, 'Previous IP ' + oldip + ' Replaced by ' + current.ip);
							}
						});
					} else {
						status.success(false);
					}
				}
			});
		}
	});
};


let args = require('./lib/args.js');

let config = require("./lib/config.js")(args, process.env);
status.init(config.interval);

// Try to get API Key from Environment:
let gandi = require('./lib/gandi.js')(config);

const currentIp = require('./lib/currentip')(config.ipcheck, config.timeout, config.debug);

// first check: could we get the record
gandi.getRecord(function(err, record) {
	if(err) {
		status.error(messages.error_init, err);
	} else {
		if (!args.dryRun) {
			console.log(messages.ok, record.rrset_name, config.domain, record.rrset_values[0]);
			checkIP();
			// start a loop every {interval} if interval
			if (config.interval > 0) {
				setInterval(checkIP, config.interval * 1000 );
			}
		} else {
			currentIp(function(err, current) {
				let ip = 'Unknown';
				if(!err) {
					ip = current.ip;
				}
				console.log(messages.dryrun, record.rrset_name, config.domain, record.rrset_values[0], messages.currentIP, ip);
			});

		}
	}
});
