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
var gandi = require('../gandi')(testconfig);

describe('Gandi Client API', function() {
	describe('Normal Flow', function() {
		// Mock Gandi API
		beforeEach(() => {
			nock('https://dns.api.gandi.net/api/v5')
			  .get("/domains/example.test/records/www/A")
			  .reply(200, {
			  		"rrset_ttl": 10800,
	           "rrset_values": ["1.2.3.4"]
			  	})
			  .put("/domains/example.test/records/www/A")
			  .reply(200);
			  });
			 
	  describe('get Records', function() {
	    it('should return DNS Records', function() {
	    	gandi.getRecord( function(err, record) {
	    		assert.equal(err, false);
	    		assert.equal(record.rrset_values[0], "1.2.3.4");
	    	});
	    });
	  });
	  describe('put Records', function() {
	    it('should update DNS Records', function() {
	    	gandi.updateRecord({ rrset_values: [ "1.2.3.5" ] }, function(err) {
	    		assert.equal(err, false);
	    	});
	  	});
	  });
	});
	describe("Error Management", function() {
	  describe('Unknown Error', function() {
	  	it("should say unknown error if no status Code", function() {
	  		let gerrors = require('../gandi')({...testconfig, endpoint: null});
	  		gerrors.getRecord(function(err, record) {
	  			assert.equal(err.substring(0, 14), 'Unknown Error:');
	  		});
	  	});
	  });
	  describe('Auth Error', function() {
	  	beforeEach(() => {
	  		nock.cleanAll();
	  		nock('https://dns.api.gandi.net/api/v5')
				  .get("/domains/example.test/records/www/A")
				  .reply(401);
	  	});
	  	it("should request to check token", function() {
	  		gandi.getRecord(function(err, record) {
	  			assert.equal(err, "Gandi Authorization declined, check GANDI_API_KEY");
	  		});
	  	});
	  });
	  describe('Wrong Address', function() {
	  	beforeEach(() => {
	  		nock.cleanAll();
	  		nock('https://dns.api.gandi.net/api/v5')
				  .get("/domains/example.test/records/www/A")
				  .reply(404);
	  	});
	  	it("should request to check record", function() {
	  		gandi.getRecord(function(err, record) {
	  			assert.equal(err, "Record doesn't exists, Please create record in zone first (update only)");
	  		});
	  	});
	  });
	  describe('Uknown Error 4xx/5xx', function() {
	  	beforeEach(() => {
	  		nock.cleanAll();
	  		nock('https://dns.api.gandi.net/api/v5')
				  .get("/domains/example.test/records/www/A")
				  .reply(500, "Strange Error");
	  	});
	  	it("should return body message", function() {
	  		gandi.getRecord(function(err, record) {
	  			assert.equal(err, "Unknown Error: Strange Error (500)");
	  		});
	  	});
	  });
	  describe('Uknown Error 4xx', function() {
	  	beforeEach(() => {
	  		nock.cleanAll();
	  		nock('https://dns.api.gandi.net/api/v5')
				  .get("/domains/example.test/records/www/A")
				  .reply(409, { message: "Strange Error" } );
	  	});
	  	it("should return the message in error object", function() {
	  		gandi.getRecord(function(err, record) {
	  			assert.equal(err, "Unknown Error: Strange Error (409)");
	  		});
	  	});
	  });
  });
});