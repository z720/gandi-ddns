const fs = require('fs');
const status = {
	lastSuccess: undefined,
	lastError: undefined,
	lastChange: undefined,
	interval: undefined,
	errorCount: 0
}

async function updateStatus() {
	return await fs.writeFileSync(`${process.cwd()}/status.json`, JSON.stringify(status));
}

async function error(type, reason) {
	status.lastError = Date.now();
	status.errorCount += 1;
	if(reason) {
		console.error('Error', type, reason);
	}
	return await updateStatus();
}

async function success(change, msg) {
	status.errorCount = 0;
	status.lastSuccess = Date.now();
	if(change) {
		status.lastChange = Date.now();
	}
	if(msg) {
		console.log(msg);
	}
	return await updateStatus();
}

module.exports = {
	success: success,
	error: error,
	init: async (interval) => {
		status.interval = interval;
		return await updateStatus();
	}
}