'use strict'

const { randomBytes, randomFill, randomFillSync } = require('crypto')

exports.randomFill = randomFill || function randomFill (buffer, offset, size, cb) {
  if (typeof offset === 'function') {
    cb = offset
    offset = 0
    size = buffer.length - offset
  } else {
    if (typeof offset !== 'number') throw new TypeError('The "offset" argument must be of type number. Received type ' + typeof offset)
    if (typeof size !== 'number') throw new TypeError('The "size" argument must be of type number. Received type ' + typeof size)
    if (typeof cb !== 'function') throw new TypeError('"cb" argument must be a function')
    if (size + offset > buffer.length) throw new RangeError('The value of "size + offset" is out of range. It must be <= ' + buffer.length + '. Received ' + (size + offset))
  }

  randomBytes(size, function (err, buf) {
    if (err) return cb(err)
    buf.copy(buffer, offset, 0, size)
    cb(null, buffer)
  })
}

exports.randomFillSync = randomFillSync || function randomFillSync (buffer, offset, size) {
  if (offset === undefined) offset = 0
  if (size === undefined) size = buffer.length - offset
  if (typeof offset !== 'number') throw new TypeError('The "offset" argument must be of type number. Received type ' + typeof offset)
  if (typeof size !== 'number') throw new TypeError('The "size" argument must be of type number. Received type ' + typeof size)
  if (size + offset > buffer.length) throw new RangeError('The value of "size + offset" is out of range. It must be <= ' + buffer.length + '. Received ' + (size + offset))

  randomBytes(size).copy(buffer, offset, 0, size)
}
