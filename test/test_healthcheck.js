"use strict";
const assert = require('assert');
const healthcheck = require('../healthcheck');


describe("Healthcheck", () => {
	let perfect = {
		"lastSuccess": Date.now(),
		"interval": 500,
		"lastError": undefined,
		"errorCount": 0
	}
	it("should fail if process count more than 2 errors", () => {
		let res = healthcheck({ ...perfect, errorCount: 3});
		assert.equal(false, res, 'Healthcheck fail');
	});
	it("should not fail if process count less than 2 errors", () => {
		let res = healthcheck({ ...perfect, errorCount: 2});
		assert.equal(true, res, 'Healthcheck success');
	});
	it("should fail if status is too old (success is too old)", () => {
		let res = healthcheck({ ...perfect, lastSuccess: (Date.now() - 1200000)});
		assert.equal(false, res, 'Healthcheck fail');
	});
	it("should fail if status is too old (error is last)", () => {
		let res = healthcheck({ ...perfect, lastSuccess: (Date.now() - 1200000), lastError: (Date.now() - 1100000)});
		assert.equal(false, res, 'Healthcheck fail');
	});
	it("should fail if status is not too old (error is last)", () => {
		let res = healthcheck({ ...perfect, lastSuccess: (Date.now() - 490000), lastError: (Date.now() - 480000)});
		assert.equal(true, res, 'Healthcheck success');
	});
});