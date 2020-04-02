# require-ancestors

Returns the chain of JavaScript files used to require a given Node
module - i.e. its ancestors.

[![Build status](https://travis-ci.org/watson/require-ancestors.svg?branch=master)](https://travis-ci.org/watson/require-ancestors)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## Installation

```
npm install require-ancestors --save
```

## Usage

Consider the following files:

**file1.js**

```js
const ancestors = require('require-ancestors')

exports.static = ancestors(module)
exports.dynamic = function () {
  return ancestors(module)
}
```

**file2.js**

```js
module.exports = require('./file1')
```

**file3.js**

```js
module.exports = require('./file2')
```

**file4.js**

```js
const file2 = require('./file2')
const file3 = require('./file3')

console.log(file3.static)
console.log(file2.static)
console.log(file3.dynamic())
console.log(file2.dynamic())
```

Now consider that we run `file4.js` using `node file4.js`.

The output from all 4 `console.log` statements will be identical:
`['/full/path/file2.js', '/full/path/file4.js']`. This is because
`ancestors(module)` always will return the filenames in order based on
the first time the module indicated by the `module` object was required.

## API

### `arr = ancestors(module)`

Arguments:

- `module` - This should be the
  [`module`](https://nodejs.org/api/modules.html#modules_module) object
  whos module you wish to get the chain of ancestors for. The `module`
  object is provided by Node core and is available to all modules

Returns an array of filenames used to require the given `module`. The
filenames are sorted in the order they where originally required with
the closest ancestor at index 0.

## License

MIT
