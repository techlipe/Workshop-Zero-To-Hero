# random-poly-fill

A polyfill for [`crypto.randomFill`] and [`crypto.randomFillSync`] from
Node.js core.

These two functions were added in Node.js v6.13.0. Use this polyfill if
you need to use these function in older versions of Node.js.

This polyfill is not optimized for speed or low resource usage. If you
can, use [`crypto.randomBytes`] directly instead.

[![npm](https://img.shields.io/npm/v/random-poly-fill.svg)](https://www.npmjs.com/package/random-poly-fill)
[![build status](https://travis-ci.org/watson/random-poly-fill.svg?branch=master)](https://travis-ci.org/watson/random-poly-fill)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## Installation

```
npm install random-poly-fill --save
```

## Usage

```js
const { randomFill, randomFillSync } = require('random-poly-fill')

const source = Buffer.alloc(10)

randomFill(source, 0, 5, function (err, target) {
  if (err) throw err
  console.log(source.toString('hex')) // fc4584c64a0000000000
  console.log(target.toString('hex')) // fc4584c64a0000000000
})

const buf = Buffer.alloc(10)

randomFillSync(buf, 5, 5)

console.log(buf.toString('hex')) // 0000000000bcc09d5877
```

## API

### `crypto.randomFill(buffer[, offset][, size], callback)`

See Node.js core documentation for [`crypto.randomFill`].

### `crypto.randomFillSync(buffer[, offset][, size])`

See Node.js core documentation for [`crypto.randomFillSync`].

## License

[MIT](LICENSE)

[`crypto.randomBytes`]: https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback
[`crypto.randomFill`]: https://nodejs.org/api/crypto.html#crypto_crypto_randomfill_buffer_offset_size_callback
[`crypto.randomFillSync`]: https://nodejs.org/api/crypto.html#crypto_crypto_randomfillsync_buffer_offset_size
