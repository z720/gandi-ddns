"use strict";
// secrets.js
// source : https://medium.com/lucjuggery/from-env-variables-to-docker-secrets-bc8802cacdfd
const fs = require("fs"),
	  util = require("util");
	  
module.exports = {
  // Get a secret from its name
  get(secret, path){
	try{
		let location = path || "/run/secrets";
	  // Swarm secret are accessible within tmpfs /run/secrets dir
	  return fs.readFileSync(util.format(`%s/%s`, location, secret), "utf8").trim();
	 } catch(e) {
	   return false;
	 }
  }
};
