"use strict";
const defaultConfig = {
  api_key: undefined,
  endpoint: "https://dns.api.gandi.net/api/v5",
  ipcheck: "https://api.ipify.org",
  domain: undefined,
  record: undefined,
  interval: 5 * 60, // every 5 minutes,
  debug: false,
};

const fs = require('fs');
function config (argv, environment) {
  let configFile = {},
    args = {...argv},
    file = args.config || "./config.json",
    env = {...environment};
  if (file) {
    if (fs.existsSync(file)) {
      try {
        configFile = require(file);
      } catch(e) {
        console.log("Unable to parse config file " + file, e);
        configFile = {};
      }
    } else {
      console.log("Specified config file " + file + " does not exist");
    }
  } else {
    console.log("No config file specified");
  }

  let envi = {};
  if (env.GANDI_API_KEY) {
    envi.api_key = env.GANDI_API_KEY;
  }
  if (env.GANDI_DOMAIN) {
    envi.domain = env.GANDI_DOMAIN;
  }
  if (env.GANDI_RECORD) {
    envi.record = env.GANDI_RECORD;
  }

  let config = { ...defaultConfig, ...configFile, ...envi};

  // Update config with arguments:
  Object.entries(config).forEach(function(item) {
    let [key, value] = item;
    if (args[key] && value !== args[key]) {
      config[key] = args[key];
    }
  });

  return config;
}

module.exports = config;
