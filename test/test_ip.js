"use strict";
var assert = require('assert');
var nock = require('nock');
var testconfig = {
  api_key: "ABCDEFGHIJKL",
  endpoint: "https://dns.api.gandi.net/api/v5",
  ipcheck: "https://api.ipify.org",
  interval: 5 * 60, // every 5 minutes,
  debug: false,
	domain: 'example.test',
  record: 'www',
};
var currentIp = require('../currentip')(testconfig.ipcheck, 200);
//timeout 200 for test socket timout

describe('ipify API', function() {
	describe('get current ip', function() {
		// Mock Gandi API
		beforeEach(() => {
			nock('https://api.ipify.org')
				.get("/")
				.reply(200, "1.2.3.4");
		});
    it('should return IP in plain text', function(done) {
    	currentIp( function(err, obj) {
    		assert.equal(err, false);
    		assert.deepEqual(obj, { ip: "1.2.3.4", msg: null });
    		done();
    	});
    });
	});
	describe("Errors", function() {
		// Mock Gandi API
		beforeEach(() => {
			nock('https://api.ipify.org')
			  .get("/")
			  .reply(500, "Internal Server Error");
		});
  	it("should return an error and a null value", function(done) {
  		currentIp( function(err, obj) {
    		assert.equal(err, 500);
			assert.deepEqual(obj, { ip: null, msg: "Internal Server Error" });
    		done();
    	});
  	});
  });
  describe("Time out", function() {
		// Mock Gandi API
		beforeEach(() => {
			nock('https://api.ipify.org')
			  .get("/")
		   .delayConnection(1000)
		   .reply(500);
		});
  	it("should return a null value for IP", function(done) {
  		currentIp( function(err, obj) {
    		assert.equal(err.code, 'ESOCKETTIMEDOUT');
			assert.equal(obj.ip, null, "IP shoudl be null");
    		done();
    	});
  	});
  });
});