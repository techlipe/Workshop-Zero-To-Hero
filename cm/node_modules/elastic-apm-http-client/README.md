# elastic-apm-http-client

[![npm](https://img.shields.io/npm/v/elastic-apm-http-client.svg)](https://www.npmjs.com/package/elastic-apm-http-client)
[![Build status in Travis](https://travis-ci.org/elastic/apm-nodejs-http-client.svg?branch=master)](https://travis-ci.org/elastic/apm-nodejs-http-client)
[![Build Status in Jenkins](https://apm-ci.elastic.co/buildStatus/icon?job=apm-agent-nodejs%2Fapm-nodejs-http-client-mbp%2Fmaster)](https://apm-ci.elastic.co/job/apm-agent-nodejs/job/apm-nodejs-http-client-mbp/job/master/)
[![codecov](https://img.shields.io/codecov/c/github/elastic/apm-nodejs-http-client.svg)](https://codecov.io/gh/elastic/apm-nodejs-http-client)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

A low-level HTTP client for communicating with the Elastic APM intake
API version 2. For support for version 1, use version 5.x of this
module.

This module is meant for building other modules that needs to
communicate with Elastic APM.

If you are looking to use Elastic APM in your app or website, you'd most
likely want to check out [the official Elastic APM agent for
Node.js](https://github.com/elastic/apm-agent-nodejs) instead.

## Installation

```
npm install elastic-apm-http-client --save
```

## Example Usage

```js
const Client = require('elastic-apm-http-client')

const client = new Client({
  serviceName: 'My App',
  agentName: 'my-nodejs-agent',
  agentVersion: require('./package.json').version,
  userAgent: 'My Custom Elastic APM Agent'
})

const span = {
  name: 'SELECT FROM users',
  duration: 42,
  start: 0,
  type: 'db.mysql.query'
}

client.sendSpan(span)
```

## API

### `new Client(options)`

Construct a new `client` object. Data given to the client will be
converted to ndjson, compressed using gzip, and streamed to the APM
Server.

Arguments:

- `options` - An object containing config options (see below)

Data sent to the APM Server as part of the metadata package:

- `agentName` - (required) The APM agent name
- `agentVersion` - (required) The APM agent version
- `serviceName` - (required) The name of the service being instrumented
- `serviceNodeName` - Unique name of the service being instrumented
- `serviceVersion` - The version of the service being instrumented
- `frameworkName` - If the service being instrumented is running a
  specific framework, use this config option to log its name
- `frameworkVersion` - If the service being instrumented is running a
  specific framework, use this config option to log its version
- `hostname` - Custom hostname (default: OS hostname)
- `environment` - Environment name (default: `process.env.NODE_ENV || 'development'`)
- `containerId` - Docker container id, if not given will be parsed from `/proc/self/cgroup`
- `kubernetesNodeName` - Kubernetes node name
- `kubernetesNamespace` - Kubernetes namespace
- `kubernetesPodName` - Kubernetes pod name, if not given will be the hostname
- `kubernetesPodUID` - Kubernetes pod id, if not given will be parsed from `/proc/self/cgroup`
- `globalLabels` - An object of key/value pairs to use to label all data reported (only applied when using APM Server 7.1+)

HTTP client configuration:

- `userAgent` - (required) The HTTP user agent that your module should
  identify it self as
- `secretToken` - The Elastic APM intake API secret token
- `serverUrl` - The APM Server URL (default: `http://localhost:8200`)
- `headers` - An object containing extra HTTP headers that should be
  used when making HTTP requests to he APM Server
- `rejectUnauthorized` - Set to `false` if the client shouldn't verify
  the APM Server TLS certificates (default: `true`)
- `serverCaCert` - The CA certificate used to verify the APM Server's
  TLS certificate, and has the same requirements as the `ca` option
  of [`tls.createSecureContext`](https://nodejs.org/api/tls.html#tls_tls_createsecurecontext_options).
- `serverTimeout` - HTTP request timeout in milliseconds. If no data is
  sent or received on the socket for this amount of time, the request
  will be aborted. It's not recommended to set a `serverTimeout` lower
  than the `time` config option. That might result in healthy requests
  being aborted prematurely (default: `15000` ms)
- `keepAlive` - If set the `false` the client will not reuse sockets
  between requests (default: `true`)
- `keepAliveMsecs` - When using the `keepAlive` option, specifies the
  initial delay for TCP Keep-Alive packets. Ignored when the `keepAlive`
  option is `false` or `undefined` (default: `1000` ms)
- `maxSockets` - Maximum number of sockets to allow per host (default:
  `Infinity`)
- `maxFreeSockets` - Maximum number of sockets to leave open in a free
  state. Only relevant if `keepAlive` is set to `true` (default: `256`)

APM Agent Configuration via Kibana:

- `centralConfig` - Whether or not the client should poll the APM
  Server regularly for new agent configuration. If set to `true`, the
  `config` event will be emitted when there's an update to an agent config
  option (default: `false`). _Requires APM Server v7.3 or later and that
  the APM Server is configured with `kibana.enabled: true`._

Streaming configuration:

- `size` - The maxiumum compressed body size (in bytes) of each HTTP
  request to the APM Server. An overshoot of up to the size of the
  internal zlib buffer should be expected as the buffer is flushed after
  this limit is reached. The default zlib buffer size is 16 kb (default:
  `768000` bytes)
- `time` - The maxiumum number of milliseconds a streaming HTTP request
  to the APM Server can be ongoing before it's ended. Set to `-1` to
  disable (default: `10000` ms)
- `bufferWindowTime` - Objects written in quick succession are buffered
  and grouped into larger clusters that can be processed as a whole.
  This config option controls the maximum time that buffer can live
  before it's flushed (counted in milliseconds). Set to `-1` for no
  buffering (default: `20` ms)
- `bufferWindowSize` - Objects written in quick succession are buffered
  and grouped into larger clusters that can be processed as a whole.
  This config option controls the maximum size of that buffer (counted
  in number of objects). Set to `-1` for no max size (default: `50`
  objects)

Data sanitizing configuration:

- `truncateKeywordsAt` - Maximum size in bytes for strings stored as
  Elasticsearch keywords. Strings larger than this will be trucated
  (default: `1024` bytes)
- `truncateErrorMessagesAt` - The maximum size in bytes for error
  messages. Messages above this length will be truncated. Set to `-1` to
  disable truncation. This applies to the following properties:
  `error.exception.message` and `error.log.message` (default: `2048`
  bytes)
- `truncateStringsAt` - The maximum size in bytes for strings.
  String values above this length will be truncated (default: `1024` bytes)
- `truncateQueriesAt` - The maximum size in bytes for database queries.
  Queries above this length will be truncated (default: `10000` bytes)

Debug options:

- `payloadLogFile` - Specify a file path to which a copy of all data
  sent to the APM Server should be written. The data will be in ndjson
  format and will be uncompressed

### Event: `config`

Emitted every time a change to the agent config is pulled from the APM
Server. The listener is passed the updated config options as a key/value
object.

Each key is the lowercase version of the environment variable, without
the `ELASTIC_APM_` prefix, e.g. `transaction_sample_rate` instead of
`ELASTIC_APM_TRANSACTION_SAMPLE_RATE`.

If no central configuration is set up for the given `serviceName` /
`environment` when the client is started, this event will be emitted
once with an empty object. This will also happen after central
configuration for the given `serviceName` / `environment` is deleted.

### Event: `close`

The `close` event is emitted when the client and any of its underlying
resources have been closed. The event indicates that no more events will
be emitted, and no more data can be sent by the client.

### Event: `error`

Emitted if an error occurs. The listener callback is passed a single
Error argument when called.

### Event: `finish`

The `finish` event is emitted after the `client.end()` method has been
called, and all data has been flushed to the underlying system.

### Event: `request-error`

Emitted if an error occurs while communicating with the APM Server. The
listener callback is passed a single Error argument when called.

The request to the APM Server that caused the error is terminated and
the data included in that request is lost. This is normally only
important to consider for requests to the Intake API.

If a non-2xx response was received from the APM Server, the status code
will be available on `error.code`.

For requests to the Intake API where the response is a structured error
message, the `error` object will have the following properties:

- `error.accepted` - An integer indicating how many events was accepted
  as part of the failed request. If 100 events was sent to the APM
  Server as part of the request, and the error reports only 98 as
  accepted, it means that two events either wasn't received or couldn't
  be processed for some reason
- `error.errors` - An array of error messages. Each element in the array
  is an object containing a `message` property (String) and an optional
  `document` property (String). If the `document` property is given it
  will contain the failed event as it was received by the APM Server

If the response contained an error body that could not be parsed by the
client, the raw body will be available on `error.response`.

The client is not closed when the `request-error` event is emitted.

### `client.sent`

An integer indicating the number of events (spans, transactions, or errors)
sent by the client. An event is considered sent when the HTTP request
used to transmit it have ended.

### `client.config(options)`

Update the configuration given to the `Client` constructor. All
configuration options can be updated except:

- The protocol part of the `serverUrl` (`http` vs `https`)
- `size`
- `time`
- `keepAlive`
- `keepAliveMsecs`
- `maxSockets`
- `maxFreeSockets`
- `centralConfig`

### `client.sendSpan(span[, callback])`

Send a span to the APM Server.

Arguments:

- `span` - A span object that can be serialized to JSON
- `callback` - Callback is called when the `span` have been flushed to
  the underlying system

### `client.sendTransaction(transaction[, callback])`

Send a transaction to the APM Server.

Arguments:

- `transaction` - A transaction object that can be serialized to JSON
- `callback` - Callback is called when the `transaction` have been
  flushed to the underlying system

### `client.sendError(error[, callback])`

Send a error to the APM Server.

Arguments:

- `error` - A error object that can be serialized to JSON
- `callback` - Callback is called when the `error` have been flushed to
  the underlying system

### `client.sendMetricSet(metricset[, callback])`

Send a metricset to the APM Server.

Arguments:

- `error` - A error object that can be serialized to JSON
- `callback` - Callback is called when the `metricset` have been flushed to
  the underlying system

### `client.flush([callback])`

Flush the internal buffer and end the current HTTP request to the APM
Server. If no HTTP request is in process nothing happens.

Arguments:

- `callback` - Callback is called when the internal buffer have been
  flushed and the HTTP request ended. If no HTTP request is in progress
  the callback is called in the next tick.

### `client.end([callback])`

Calling the `client.end()` method signals that no more data will be sent
to the `client`. If the internal buffer contains any data, this is
flushed before ending.

Arguments:

- `callback` - If provided, the optional `callback` function is attached
  as a listener for the 'finish' event

### `client.destroy()`

Destroy the `client`. After this call, the client has ended and
subsequent calls to `sendSpan()`, `sendTransaction()`, `sendError()`,
`flush()`, or `end()` will result in an error.

## License

[MIT](LICENSE)
