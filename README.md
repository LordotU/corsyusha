# Corsyusha — Local CORS Proxy

[![License](https://img.shields.io/badge/License-MIT-000000.svg)](https://opensource.org/licenses/MIT)
[![Coverage Status](https://coveralls.io/repos/github/LordotU/corsyusha/badge.svg)](https://coveralls.io/github/LordotU/corsyusha)

## Description

Simple and fast (built on top of [fastify](https://www.npmjs.com/package/fastify) proxy to bypass [CORS](https://developer.mozilla.org/ru/docs/Web/HTTP/CORS) issues during prototyping against existing APIs without having to worry about CORS

This module was built to solve the issue of getting errors like this:

```text
... has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
```

## Installation

```bash
npm install -g corsyusha
# or
yarn global add corsyusha
```

## Testing

```bash
yarn test:jest # Runs Jest with coverage collection
yarn test:coverage # Sends coverage to .coveralls.io
yarn test # yarn test:jest && yarn test:coverage
```

## Usage

Let's imagine API endpoint that we want to request that has CORS issues:

```text
https://licenseapi.herokuapp.com/licenses/mit
```

Start Proxy:

```bash
corsyusha --url https://licenseapi.herokuapp.com
```

Or:

```bash
CORSYUSHA_URL=https://licenseapi.herokuapp.com corsyusha
```

Or you may pull Docker image and run a container:

```bash
docker pull lordotu/corsyusha

docker run -dti \
  -e CORSYUSHA_URL=https://licenseapi.herokuapp.com \
  -e CORSYUSHA_HOST=0.0.0.0 \
  -p 8118:8118 \
  --name corsyusha \
  lordotu/corsyusha
```

Then in your client code, new API endpoint:

```text
http://localhost:8118/proxy/licenses/mit
```

End result will be a request to `https://licenseapi.herokuapp.com/licenses/mit` without the CORS issues!

Alternatively you can install the package locally:

```bash
npm install corsyusha
# or
yarn add corsyusha
```

And add a script to your project:

```json
 "scripts": {
   "proxy": "corsyusha --url https://licenseapi.herokuapp.com"
 }
```

Or:

```json
 "scripts": {
   "proxy": "CORSYUSHA_URL=https://licenseapi.herokuapp.com corsyusha"
 }
```

## Configuring

You may set params via command line args or via env variables. All defaults are stored in `.env` file in the root directory.

Only one argument is **required**: `--url` (or `CORSYUSHA_URL` if you prefer env variables).

### Options

| Option          | Shorthand | Example                           |   Default |
|-----------------|-----------|-----------------------------------|----------:|
| --url           | -u        | https://licenseapi.herokuapp.com  |           |
| --port          | -p        | 8119                              |      8118 |
| --host          | -h        | 0.0.0.0                           | localhost |
| --urlSection    | -s        | trhough                           |     proxy |
| --serverLogging | -l        | true                              |     false |
| --headers       |           | {"X-Requested-With": "Corsyusha"} |        {} |
| --headers       |           | {"X-Requested-With": "Corsyusha"} |        {} |
| --origin        | -o        | http://127.0.0.1                  |         * |
| --reflectOrigin | -r        | true                              |     false |

### Environment variables

| Option                   | Example                           |   Default |
|--------------------------|-----------------------------------|----------:|
| CORSYUSHA_URL            | https://licenseapi.herokuapp.com  |           |
| CORSYUSHA_PORT           | 8119                              |      8118 |
| CORSYUSHA_HOST           | 0.0.0.0                           | localhost |
| CORSYUSHA_URL_SECTION    | trhough                           |     proxy |
| CORSYUSHA_SERVER_LOGGING | true                              |     false |
| CORSYUSHA_HEADERS        | {"X-Requested-With": "Corsyusha"} |        {} |
| CORSYUSHA_ORIGIN         | http://127.0.0.1                  |         * |
| CORSYUSHA_REFLECT_ORIGIN | true                              |     false |
