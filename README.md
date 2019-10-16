
# gandi-ddns

Simple script to update DNS A record of your domain dynamically using gandi.net's API

Inspired from https://github.com/matt1/gandi-ddns

The script simply connects to [Gandi LiveDNS API](http://doc.livedns.gandi.net) to update a specific A record from the current public IP Address.
The script use [ipify](https://www.ipify.org) to get current IP Address, if the address is different from the one in the selected A record, the record is updated with the current IP Address.

## Pre-Requisite

You'll need a GANDI API Key to use the script. You can create one in the Security section of your [Gandi Account](https://account.gandi.net/).

## How to use

### Direct run

```shell
git clone https://github.com/z720/gandi-ddns .
cd gandi-ddns
npm install
export GANDI_API_KEY=<your API Key>
npm start <yourdomain.example> <subdomain>
```

### Using a docker container

Using Environment Variables

```shell
docker run -e "GANDI_API_KEY=<your API Key>" -d z720/gandi-ddns <yourdomain.example> <subdomain>
```

## Configuration

It's possible to update the configuration by creating a config.json file in the script directory.

- `api_key`: Your API key if you want to store it in a file (probaby unsecure)
- `endpoint` (default `https://dns.api.gandi.net/api/v5`) The GANDI liveDNS endpoint if you need to overwrite it
- `ipcheck` (default `https://api.ipify.org`) The current public IP reference if you need to overwrite it (should return the IP address in plain text).
- `domain`: The domain to get the zone file from
- `record`: The record name to fetch, the record must exists and be an A record. The script only updates an existing records. Should probably work fine with `@` record as well as `*.subdomain`.
- `interval`: (default `300` every 5 minutes) Time in minutes between each checks, for each check the script gets the record and the current IP Address.
- `debug`: Enable debugging - `false` by default.

## Limitations

- Only one record is updated, it means that only one subdomain/domain is updated. You can use a CNAME records to match the updated records or run several instance of the script at once.
