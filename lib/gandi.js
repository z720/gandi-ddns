"use strict";

const request = require('request');

const messages = {
	"e401": "Gandi Authorization declined, check GANDI_API_KEY",
	"e404": "Record doesn't exists, Please create record in zone first (update only)",
	"e4xx": "Unknown Error: ",
	"error_domain": "Configuration error missing domain or record to manage",
	"error_unknown": "Unknown Error",
};

module.exports = function(config) {
	let callAPI = function(data, func) {
		/*
		curl -H"X-Api-Key: $APIKEY" \
			https://dns.api.gandi.net/api/v5/domains/example.com/records
		*/

		let method = (func == undefined) ? 'GET': 'PUT';
		let callback = (func == undefined) ? data: func;
		if ( typeof callback !== 'function' ) {
			throw("Unexpected null callback");
		}
		if (config.domain == undefined || config.record == undefined) {
			callback(messages.error_domain);
		}
		let options = {
			method: method,
			url: config.endpoint + "/domains/" + config.domain + "/records/" + config.record + "/A",
			headers: {
				'X-Api-Key': config.api_key,
				'Authorization': `ApiKey ${config.api_key}`
			},
			json: true
		};
		if (method == 'PUT') {
			options.body = data;
		}
		if (config.debug) console.debug(method, options.url);
		request(options, function(err, res, body) {
			if (config.debug) console.debug(err, body);
			if(!res || err) {
			  callback(messages.error_unknown + ": " + err);
			} else if (res.statusCode && res.statusCode == 401) {
				callback(messages.e401);
			} else if (res && res.statusCode && res.statusCode == 404) {
				callback(messages.e404);
			} else if (res.statusCode > 399) {
				let error = body.message || body;
				callback(messages.e4xx + error + " (" + res.statusCode + ")" , body);
			} else {
				callback(false, body);
			}
		});
	};
	console.log(config.endpoint);
	return {
		getRecord: function(callback) {
			callAPI(callback);
		},
		updateRecord: function(data, callback) {
			callAPI(data, callback);
		}
	};
};
