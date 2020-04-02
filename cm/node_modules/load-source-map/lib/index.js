'use strict'

var fs = require('fs')
var path = require('path')
var semver = require('semver')
var SourceMapConsumer = require('source-map').SourceMapConsumer

var INLINE_SOURCEMAP_REGEX = /^data:application\/json[^,]+base64,/
var SOURCEMAP_REGEX = /(?:\/\/[@#][ \t]+sourceMappingURL=([^\s'"]+?)[ \t]*$)|(?:\/\*[@#][ \t]+sourceMappingURL=([^*]+?)[ \t]*(?:\*\/)[ \t]*$)/
var READ_FILE_OPTS = semver.lt(process.version, '0.9.11') ? 'utf8' : {encoding: 'utf8'}

module.exports = function readSourceMap (filename, cb) {
  fs.readFile(filename, READ_FILE_OPTS, function (err, sourceFile) {
    if (err) {
      return cb(err)
    }

    // Look for a sourcemap URL
    var sourceMapUrl = resolveSourceMapUrl(sourceFile, path.dirname(filename))
    if (!sourceMapUrl) {
      return cb()
    }

    // If it's an inline map, decode it and pass it through the same consumer factory
    if (isInlineMap(sourceMapUrl)) {
      return onMapRead(null, decodeInlineMap(sourceMapUrl))
    }

    // Load actual source map from given path
    fs.readFile(sourceMapUrl, READ_FILE_OPTS, onMapRead)

    function onMapRead (readErr, sourceMap) {
      if (readErr) {
        readErr.message = 'Error reading sourcemap for file "' + filename + '":\n' + readErr.message
        return cb(readErr)
      }

      var consumer
      try {
        consumer = new SourceMapConsumer(sourceMap)
      } catch (parseErr) {
        parseErr.message = 'Error parsing sourcemap for file "' + filename + '":\n' + parseErr.message
        return cb(parseErr)
      }

      return cb(null, consumer)
    }
  })
}

function resolveSourceMapUrl (sourceFile, sourcePath) {
  var lines = sourceFile.split(/\r?\n/)
  var sourceMapUrl = null
  for (var i = lines.length - 1; i >= 0 && !sourceMapUrl; i--) {
    sourceMapUrl = lines[i].match(SOURCEMAP_REGEX)
  }

  if (!sourceMapUrl) {
    return null
  }

  return isInlineMap(sourceMapUrl[1])
    ? sourceMapUrl[1]
    : path.resolve(sourcePath, sourceMapUrl[1])
}

function isInlineMap (url) {
  return INLINE_SOURCEMAP_REGEX.test(url)
}

function decodeInlineMap (data) {
  var rawData = data.slice(data.indexOf(',') + 1)
  return new Buffer(rawData, 'base64').toString()
}
