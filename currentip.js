"use strict";
const request = require('request');


module.exports = function(url, timeout) {
	// check existing record
	return function(callback) {
		let opts = { json: true, url : url };
		if (timeout > 199) {
			opts.timeout = timeout;
		}
		request.get(opts, (err, res, body) => {
			if (err) {
				callback(err, null);
			} else if (res.statusCode > 399) {
				callback(res.statusCode, body);
			} else {
				callback(false, { ip: body });
			}
		});
	};
}