'use strict'

var path = require('path')
var test = require('tape')
var loadSourceMap = require('../')

var FIXTURES_DIR = path.join(__dirname, 'fixtures')

test('should give back undefined as result if no sourcemap is referenced', function (t) {
  loadSourceMap(path.join(FIXTURES_DIR, 'noSourcemap.js'), function (err, sourcemap) {
    t.ifError(err, 'should not error')
    t.false(sourcemap, 'sourcemap should be undefined')
    t.end()
  })
})

test('should handle inline sourcemaps', function (t) {
  loadSourceMap(path.join(FIXTURES_DIR, 'lib-inline', 'example.js'), function (err, sourcemap) {
    t.ifError(err, 'should not error')

    var generated = {line: 30, column: 13}
    var expected = {line: 15, column: 9, name: 'setState', source: '../src/example.js'}
    t.deepEqual(sourcemap.originalPositionFor(generated), expected, 'should have correct source mapping')
    t.end()
  })
})

test('should handle external sourcemaps', function (t) {
  loadSourceMap(path.join(FIXTURES_DIR, 'lib', 'example.js'), function (err, sourcemap) {
    t.ifError(err, 'should not error')

    var generated = {line: 30, column: 13}
    var expected = {line: 15, column: 9, name: 'setState', source: '../src/example.js'}
    t.deepEqual(sourcemap.originalPositionFor(generated), expected, 'should have correct source mapping')
    t.end()
  })
})

test('should call back with error on external, missing sourcemap', function (t) {
  loadSourceMap(path.join(FIXTURES_DIR, 'missingSourcemap.js'), function (err) {
    t.equal(err && err.code, 'ENOENT', 'should error')
    t.ok(err.message.indexOf('reading sourcemap for file') !== -1, 'contains reference location')
    t.end()
  })
})

test('should call back with error on external, invalid sourcemap', function (t) {
  loadSourceMap(path.join(FIXTURES_DIR, 'invalidSourcemap.js'), function (err) {
    t.ok(err.message.indexOf('parsing sourcemap for file') !== -1, 'contains reference location')
    t.end()
  })
})

test('should call back with error on inline, invalid sourcemap', function (t) {
  loadSourceMap(path.join(FIXTURES_DIR, 'invalidInlineSourcemap.js'), function (err) {
    t.ok(err.message.indexOf('parsing sourcemap for file') !== -1, 'contains reference location')
    t.end()
  })
})

test('should call back with error if source file does not exist', function (t) {
  loadSourceMap(path.join(FIXTURES_DIR, 'nonExistant.js'), function (err) {
    t.equal(err && err.code, 'ENOENT', 'should error')
    t.end()
  })
})
