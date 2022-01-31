"use strict";
const assert = require('assert');
const status = require('../lib/status');
const fs = require('fs');

function assertApproxDate(D1,D2, msg) {
	let ts = new Date(D2);
	assert.ok(Math.abs(D1 - D2) < 10, `same 10ms ${msg} ${D1 - D2} ${ts}`);
}
function readStatus() {
	return JSON.parse(fs.readFileSync(process.cwd() + '/status.json'));
}

fs.writeFileSync(process.cwd() + '/status.json', "{}");

describe('Status report', () => {
	it("should save initial interval on init", async () => {
		let st;
		await status.init(999);
		st = readStatus();
		console.log('interval', st);
		process.exit(1);
		assert.equal(st.interval, 999, 'Interval');
	});
	it("should save current date as lastSuccess on success", async () => {
		let st, start = Date.now();
		await status.success();
		st = readStatus();
		assertApproxDate(start, st.lastSuccess, 'lastSuccess');
	});
	it("should save current date as lastChange on change", async () => {
		let st, f, start = Date.now();
		await status.success(true, '---');
		st = readStatus();
		//require(process.cwd() + '/status.json');
		assert.ok(st.lastChange, 'lastChange is set');
		assertApproxDate(start, st.lastSuccess, 'lastSuccess');
		assertApproxDate(start, st.lastChange, 'lastChange');
	});
	it("should save current date as lastError on error", async () => {
		let st, start = Date.now();
		await status.success(); //reset errorCount
		st = readStatus();
		assert.equal(0, st.errorCount, `Error Count RESET`);
		await status.error('test','nothing');
		st = readStatus();
		assertApproxDate(start, st.lastError, 'lastError');
		assert.equal(1, st.errorCount, 'ErrorCount');
	});
	it("should increment errorCount on repeated errors", async () => {
		let st;
		await status.success() //reset
		st = readStatus();
		assert.equal(0, st.errorCount, `Error Count RESET`);
		for(let i = 1; i < 11; i++) {
			await status.error('test');
		}
		st = readStatus();
		assert.equal(10, st.errorCount, `Error Count`);
	});
});