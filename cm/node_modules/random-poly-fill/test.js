'use strict'

const test = require('tape')
const crypto = require('./')

test('randomFill - no callback', function (t) {
  t.throws(function () {
    crypto.randomFill(Buffer.alloc(10), 0, 10)
  })
  t.end()
})

test('randomFill - invalid offset/size', function (t) {
  t.throws(function () {
    crypto.randomFill(Buffer.alloc(10), null, 10, function () {})
  })
  t.throws(function () {
    crypto.randomFill(Buffer.alloc(10), undefined, 10, function () {})
  })
  t.throws(function () {
    crypto.randomFill(Buffer.alloc(10), null, null, function () {})
  })
  t.throws(function () {
    crypto.randomFill(Buffer.alloc(10), 0, null, function () {})
  })
  t.throws(function () {
    crypto.randomFill(Buffer.alloc(10), 0, undefined, function () {})
  })
  t.throws(function () {
    crypto.randomFill(Buffer.alloc(10), 1, 10, function () {})
  })
  t.end()
})

test('randomFillSync - invalid offset/size', function (t) {
  t.throws(function () {
    crypto.randomFillSync(Buffer.alloc(10), null, 10)
  })
  t.throws(function () {
    crypto.randomFillSync(Buffer.alloc(10), null)
  })
  t.throws(function () {
    crypto.randomFillSync(Buffer.alloc(10), 0, null)
  })
  t.throws(function () {
    crypto.randomFillSync(Buffer.alloc(10), 1, 10)
  })
  t.end()
})

test('randomFill - complete fill, explicit offset+size', function (t) {
  const source = Buffer.alloc(10)
  crypto.randomFill(source, 0, 10, validator(t, source))
})

test('randomFillSync - complete fill, explicit offset+size', function (t) {
  const buf = Buffer.alloc(10)
  crypto.randomFillSync(buf, 0, 10)
  validateNonZero(t, buf)
  t.end()
})

test('randomFillSync - complete fill, explicit offset', function (t) {
  const buf = Buffer.alloc(10)
  crypto.randomFillSync(buf, 0)
  validateNonZero(t, buf)
  t.end()
})

test('randomFillSync - complete fill, explicit size', function (t) {
  const buf = Buffer.alloc(10)
  crypto.randomFillSync(buf, undefined, 10)
  validateNonZero(t, buf)
  t.end()
})

test('randomFillSync - complete fill', function (t) {
  const buf = Buffer.alloc(10)
  crypto.randomFillSync(buf)
  validateNonZero(t, buf)
  t.end()
})

test('randomFill - fill beginning, explicit offset+size', function (t) {
  const source = Buffer.alloc(10)
  crypto.randomFill(source, 0, 5, validator(t, source, function (target) {
    const untouched = target.slice(5)
    t.equal(untouched.length, 5)
    validateZero(t, untouched)
    t.end()
  }))
})

test('randomFillSync - fill beginning, explicit offset+size', function (t) {
  const buf = Buffer.alloc(10)
  crypto.randomFillSync(buf, 0, 5)
  validateNonZero(t, buf)
  const untouched = buf.slice(5)
  t.equal(untouched.length, 5)
  validateZero(t, untouched)
  t.end()
})

test('randomFillSync - fill beginning, explicit size', function (t) {
  const buf = Buffer.alloc(10)
  crypto.randomFillSync(buf, undefined, 5)
  validateNonZero(t, buf)
  const untouched = buf.slice(5)
  t.equal(untouched.length, 5)
  validateZero(t, untouched)
  t.end()
})

test('randomFill - fill end, explicit offset+size', function (t) {
  const source = Buffer.alloc(10)
  crypto.randomFill(source, 5, 5, validator(t, source, function (target) {
    const untouched = target.slice(0, 5)
    t.equal(untouched.length, 5)
    validateZero(t, untouched)
    t.end()
  }))
})

test('randomFillSync - fill end, explicit offset+size', function (t) {
  const buf = Buffer.alloc(10)
  crypto.randomFillSync(buf, 5, 5)
  validateNonZero(t, buf)
  const untouched = buf.slice(0, 5)
  t.equal(untouched.length, 5)
  validateZero(t, untouched)
  t.end()
})

test('randomFillSync - fill end, explicit offset', function (t) {
  const buf = Buffer.alloc(10)
  crypto.randomFillSync(buf, 5)
  validateNonZero(t, buf)
  const untouched = buf.slice(0, 5)
  t.equal(untouched.length, 5)
  validateZero(t, untouched)
  t.end()
})

function validator (t, source, cb) {
  return function (err, target) {
    t.error(err, 'should not generate error')
    t.equal(source.length, target.length, 'target should be the same size as the source')
    t.ok(target.equals(source), 'target and source should be equal')
    validateNonZero(t, target)
    if (cb) return cb(target)
    t.end()
  }
}

function validateNonZero (t, buf) {
  t.ok(buf.some(function (ch) {
    return ch > 0
  }), 'target should contain non-zero bytes')
}

function validateZero (t, buf) {
  for (let ch of buf) {
    t.equal(ch, 0)
  }
}
