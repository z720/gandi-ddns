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
function config (file) {
  let configFile = {};
  if (file) {
    if (fs.existsSync(file)) {
      try {
        configFile = require(file);
      } catch(e) {
        console.log("Unable to parse config file " + file, e);
        configFile = {};
      }
    } else {
      console.log("Specified config field " + file + " does not exist");
    }
  } else {
    console.log("No config file specified");
  }

  let envi = {};
  if (process.env.GANDI_API_KEY) {
    envi.api_key = process.env.GANDI_API_KEY;
  }
  if (process.env.GANDI_DOMAIN) {
    envi.domain = process.env.GANDI_DOMAIN;
  }
  if (process.env.GANDI_RECORD) {
    envi.record = process.env.GANDI_RECORD;
  }

  let config = { ...defaultConfig, ...configFile, ...envi};
  // Ultimately get config form args:
  // node index.js example.com  ddns
  if (process.argv[3]) {
    config.record = process.argv[3];
  }
  if (process.argv[2]) {
    config.domain = process.argv[2];
  }
  return config;
}

module.exports = config;
