# redact-secrets

Deeply iterate over an object and redact secret values by replacing them
with a predefined string.

[![Build status](https://travis-ci.org/watson/redact-secrets.svg?branch=master)](https://travis-ci.org/watson/redact-secrets)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## Installation

```
npm install redact-secrets --save
```

## Usage

```js
var redact = require('redact-secrets')('[REDACTED]')

var obj = {
  username: 'watson',
  password: 'hhGu38gf',
  extra: {
    id: 1,
    token: 'some-secret-stuff'
    card: '1234 1234 1234 1234'
  }
}

console.log(redact.map(obj))
// {
//   username: 'watson',
//   password: '[REDACTED]',
//   extra: {
//     id: 1,
//     token: '[REDACTED]'
//     card: '[REDACTED]'
//   }
// }
```

## API

### `redact = Redact(string)`

This module exposes a init function which takes a single argument: The
`string` used as a replacement variable for values that are redacted.

The init function returns an object holding two functions: `map` and
`forEach`.

### `redact.map(obj)`

Returns a clone of the given `obj` with its secret values redacted.

### `redact.forEach(obj)`

Redacts the secret values of the `obj` in-place.

## License

MIT
