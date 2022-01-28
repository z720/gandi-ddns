"use strict";
var assert = require('assert');
describe('Configuration', function() {
  describe('from default', function() {
    it('should return undefined api_key when the value is read from default', function() {
      var c = require("../lib/config")({ config: __dirname + "/fixtures/nope.json" },{});
      assert.equal(c.api_key, undefined, "api-key undefined");
    });
  });
  describe('from good.json', function() {
    it('should return abc123 api_key when the value is read from good file', function() {
      var c = require("../lib/config")({ "config": __dirname + "/fixtures/good.json" }, {});
      assert.equal(c.api_key, "abc123");
    });
  });
  describe('from bad.notjson', function() {
    it('should return undefined api_key when the value is read from bad file', function() {
      var c = require("../lib/config")({ "config": __dirname + "/fixtures/bad.json"}, {});
      assert.equal(c.api_key, undefined);
    });
  });
  describe('from inexistant.json', function() {
    it('should return undefined api_key when the value is read from bad file', function() {
      var c = require("../lib/config")({ "config": __dirname + "/fixtures/inexistant.json"}, {});
      assert.equal(c.api_key, undefined);
    });
  });
  describe('from good.json and env variable', function() {
    it('should return the env value for api_key', function() {
      let env = { "GANDI_API_KEY": "def456" };
      var c = require("../lib/config")({ "config": __dirname + "/fixtures/good.json"}, env);
      assert.equal(c.api_key, "def456");
    });
  });
});
