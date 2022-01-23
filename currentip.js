"use strict";
const request = require('request');


module.exports = function(url, timeout, debug) {
	// check existing record
	if (debug) {
		request.debug = true;
	}
	return function(callback) {
		let opts = { json: true, url: url }, response = {
			ip: null,
			msg: null
		};
		if (timeout > 199) {
			opts.timeout = timeout;
		}
		request.get(opts, (err, res, body) => {
			if (err) {
				response.msg = err;
				callback(err, response);
			} else if (res.statusCode > 399) {
				response.msg = body;
				callback(res.statusCode, response);
			} else {
				response.ip = body;
				callback(false, response);
			}
		});
	};
}