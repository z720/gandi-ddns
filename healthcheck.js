#!/usr/bin/env node
function exit(ok) {
	if(!ok) {
		process.exit(1);
	}
	process.exit();
}
function healthcheck(status) {
	try {
		if(status.errorCount > 2) {
			console.error('too much errors');
			return false;
		}
		let upd = Math.max(status.lastSuccess || 0, status.lastError || 0);
		let diff = Date.now() - upd - status.interval * 1000;
		if(diff > 2000 ) {
			console.error('running late ', diff/1000);
			return false;
		}
	} catch(e) {
		console.error('Exception', e);
		return false;
	}
	return true;
}
module.exports = healthcheck;
// if run direct
if (require.main == module) {
	exit(healthcheck(require('./status.json')));
}