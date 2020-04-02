# is-secret

A distributed maintained collection of patterns that indicate that
something probably is secret.

This is useful if you want to filter sensitive values in a data set.

This module uses a very simple algorithm that will not catch everthing.
Use at your own risk.

[![npm](https://img.shields.io/npm/v/is-secret.svg)](https://www.npmjs.com/package/is-secret)
[![Build status](https://travis-ci.org/watson/is-secret.svg?branch=master)](https://travis-ci.org/watson/is-secret)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## Installation

```
npm install is-secret --save
```

## Usage

```js
var isSecret = require('is-secret')

var data = {
  username: 'watson',
  password: 'f8bY2fg8',
  card: '1234 1234 1234 1234' // credit card number
}

Object.keys(data).forEach(function (key) {
  if (isSecret.key(key) ||
      isSecret.value(data[key])) data[key] = '********'
})

console.log(data)
// {
//   username: 'watson',
//   password: '********',
//   card: '********'
// }
```

_If you need functionality similar to what is shown in this example, I
suggest you take a look at the
[redact-secrets](https://github.com/watson/redact-secrets) module._

## API

### `secret.key(string)`

Validates the given `string` against a list of key names known to
typically indicate secret data.

Returns `true` if the `string` is considered secret. Otherwise `false`.

### `secret.value(string)`

Validates the given `string` against a list of patterns that indicates
secret data.

Returns `true` if the `string` is considered secret. Otherwise `false`.

## License

[MIT](LICENSE)
