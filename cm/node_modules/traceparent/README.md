# traceparent

[![npm](https://img.shields.io/npm/v/traceparent.svg)](https://www.npmjs.com/package/traceparent)
[![Build status](https://travis-ci.org/elastic/node-traceparent.svg?branch=master)](https://travis-ci.org/elastic/node-traceparent)
[![codecov](https://img.shields.io/codecov/c/github/elastic/node-traceparent.svg)](https://codecov.io/gh/elastic/node-traceparent)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

This is a basic implementation of the traceparent header part of the W3C trace context spec.

## Installation

```
npm install traceparent
```

## Example Usage

```js
const crypto = require('crypto')
const TraceParent = require('traceparent')

const version = Buffer.alloc(1).toString('hex')
const traceId = crypto.randomBytes(16).toString('hex')
const id = crypto.randomBytes(8).toString('hex')
const flags = '01'

const header = `${version}-${traceId}-${id}-${flags}`

const parent = TraceParent.fromString(header)
```

## API

### `new TraceParent(buffer)`

Construct a new `TraceParent` instance from an existing buffer. The contents are binary data that corresponds to the structure of the [W3C traceparent header][traceparent] format, with separators removed.

### `TraceParent.fromString(header)`

Reconstruct a `TraceParent` instance from a formatted [W3C traceparent header][traceparent] string.

### `TraceParent.startOrResume(parent, settings)`

Resume from a parent context, if given, or start a new context. Accepts another `TraceParent` instance, a [W3C traceparent header][traceparent] string, or a `Span` or `Transaction` instance from [elastic-apm-node](http://npmjs.org/package/elastic-apm-node).

Requires a `settings` object with a `transactionSampleRate` value from 0.0 to 1.0 to generate a sampling decision for the context. This will only be applied when starting a _new_ context. When continuing an existing context, the sampling decision will be propagated into all child contexts.

### `traceParent.recorded`

Returns `true` if this `TraceParent` is sampled.

### `traceParent.traceId`

The `traceId` property will propagate through all children in the tree to link them all together.

### `traceParent.id`

The `id` property is used to uniquely identify a given `TraceParent` instance within the tree.

### `traceParent.parentId`

The `parentId` property links this context to its direct parent in the tree.

### `traceParent.flags`

The `flags` property is used to store metadata such as the sampling decision.

### `traceParent.version`

The `version` property corresponds to the version segment of the [W3C traceparent header][traceparent].

### `traceParent.child()`

Create a new `TraceParent` instance that is a child of this one.

### `traceParent.toString()`

Formats the `TraceParent` instance as a [W3C traceparent header][traceparent].

### `traceParent.ensureParentId()`

Return the parent ID, if there is none, generate one. This is useful in browser instrumentation to produce a starting span around a browser request which was not instrumented prior to page load.

## License

[MIT](LICENSE)

[traceparent]: https://github.com/w3c/trace-context/blob/master/spec/20-http_header_format.md
