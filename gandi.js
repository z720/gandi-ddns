"use strict";

const request = require('request');

const messages = {
	"e401": "Gandi Authorization declined, check GANDI_API_KEY",
	"e404": "Record doesn't exists, Please create record in zone first (update only)",
	"e4xx": "Unknown Error: ",
	"error_domain": "Configuration error missing domain or record to manage",
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
				'X-Api-Key': config.api_key
			},
			json: true
		};
		if (method == 'PUT') {
			options.body = data;
		}
		if (config.debug) console.debug(method, options.url);
		request(options, function(err, res, body) {
			if(!res || err) {
				callback(messages.e4xx + "(" + err || 'no status' + ")" , body);
			} else if (res.statusCode && res.statusCode == 401) {
				callback(messages.e401);
			} else if (res && res.statusCode && res.statusCode == 404) {
				callback(messages.e404);
			} else if (res.statusCode > 399) {
				callback(messages.e4xx + body.message + "(" + res.statusCode + ")" , body);
			} else {
				callback(false, body);
			}
		});
	};
	return {
		getRecord: function(callback) {
			callAPI(callback);
		},
		updateRecord: function(data, callback) {
			callAPI(data, callback);
		}
	};

};
