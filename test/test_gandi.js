"use strict";
var assert = require('assert');
var nock = require('nock');
var gandi = require('../gandi')({
  api_key: "ABCDEFGHIJKL",
  endpoint: "https://dns.api.gandi.net/api/v5",
  ipcheck: "https://api.ipify.org",
  interval: 5 * 60, // every 5 minutes,
  debug: false,
	domain: 'example.test',
  record: 'www',
});

describe('Gandi Client API', function() {
	// Mock Gandi API
	beforeEach(() => {
		nock('https://dns.api.gandi.net/api/v5')
		  .get("/domains/example.test/records/www/A",)
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