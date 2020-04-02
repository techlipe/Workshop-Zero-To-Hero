'use strict'

var test = require('tape')
var clone = require('clone')
var redact = require('./')

test('redact.map', function (t) {
  var input = {
    foo: 'non-secret',
    secret: 'secret',
    sub1: {
      foo: 'non-secret',
      password: 'secret'
    },
    sub2: [{
      foo: 'non-secret',
      token: 'secret'
    }]
  }

  var expected = {
    foo: 'non-secret',
    secret: 'redacted',
    sub1: {
      foo: 'non-secret',
      password: 'redacted'
    },
    sub2: [{
      foo: 'non-secret',
      token: 'redacted'
    }]
  }

  var orig = clone(input)
  var result = redact('redacted').map(input)

  t.deepEqual(result, expected)
  t.deepEqual(input, orig)
  t.end()
})

test('redact.forEach', function (t) {
  var input = {
    foo: 'non-secret',
    secret: 'secret',
    sub1: {
      foo: 'non-secret',
      password: 'secret'
    },
    sub2: [{
      foo: 'non-secret',
      token: 'secret'
    }]
  }

  var expected = {
    foo: 'non-secret',
    secret: 'redacted',
    sub1: {
      foo: 'non-secret',
      password: 'redacted'
    },
    sub2: [{
      foo: 'non-secret',
      token: 'redacted'
    }]
  }

  var result = redact('redacted').forEach(input)

  t.equal(result, undefined)
  t.deepEqual(input, expected)
  t.end()
})
