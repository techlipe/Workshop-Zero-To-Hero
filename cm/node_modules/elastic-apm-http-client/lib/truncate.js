'use strict'

var breadthFilter = require('breadth-filter')
var truncate = require('unicode-byte-truncate')

exports.metadata = truncMetadata
exports.transaction = truncTransaction
exports.span = truncSpan
exports.error = truncError
exports.metricset = truncMetricSet

function truncMetadata (metadata, opts) {
  return breadthFilter(metadata, {
    onArray,
    onObject,
    onValue (value, key, path) {
      if (typeof value !== 'string') {
        return value
      }

      let max = opts.truncateStringsAt
      switch (path[0]) {
        case 'service':
          switch (path[1]) {
            case 'name':
            case 'version':
            case 'environment':
              max = opts.truncateKeywordsAt
              break

            case 'agent':
            case 'framework':
            case 'language':
            case 'runtime':
              switch (path[2]) {
                case 'name':
                case 'version':
                  max = opts.truncateKeywordsAt
                  break
              }
              break
          }
          break

        case 'process':
          if (path[1] === 'title') {
            max = opts.truncateKeywordsAt
          }
          break

        case 'system':
          switch (path[1]) {
            case 'architecture':
            case 'hostname':
            case 'platform':
              max = opts.truncateKeywordsAt
              break
          }
          break
      }

      return truncate(value, max)
    }
  })
}

function truncTransaction (trans, opts) {
  const result = breadthFilter(trans, {
    onArray,
    onObject: onObjectWithHeaders,
    onValue (value, key, path) {
      if (typeof value !== 'string') {
        if (isHeader(path)) return String(value)

        return value
      }

      let max = opts.truncateStringsAt
      switch (path[0]) {
        case 'name':
        case 'type':
        case 'result':
        case 'id':
        case 'trace_id':
        case 'parent_id':
          max = opts.truncateKeywordsAt
          break

        case 'context':
          max = contextLength(path, opts)
          break
      }

      return truncate(value, max)
    }
  })

  return Object.assign({
    name: 'undefined',
    type: 'undefined',
    result: 'undefined'
  }, result)
}

function truncSpan (span, opts) {
  let result = breadthFilter(span, {
    onArray,
    onObject,
    onValue (value, key, path) {
      if (typeof value !== 'string') {
        return value
      }

      let max = opts.truncateStringsAt
      switch (path[0]) {
        case 'name':
        case 'type':
        case 'id':
        case 'trace_id':
        case 'parent_id':
        case 'transaction_id':
        case 'subtype':
        case 'action':
          max = opts.truncateKeywordsAt
          break

        case 'context':
          max = contextLength(path, opts)
          break
      }

      return truncate(value, max)
    }
  })

  result = truncateCustomKeys(
    result,
    opts.truncateCustomKeysAt,
    [
      'name',
      'type',
      'id',
      'trace_id',
      'parent_id',
      'transaction_id',
      'subtype',
      'action',
      'context'
    ]
  )

  return Object.assign({
    name: 'undefined',
    type: 'undefined'
  }, result)
}

function truncError (error, opts) {
  return breadthFilter(error, {
    onArray,
    onObject: onObjectWithHeaders,
    onValue (value, key, path) {
      if (typeof value !== 'string') {
        if (isHeader(path)) return String(value)

        return value
      }

      let max = opts.truncateStringsAt
      switch (path[0]) {
        case 'id':
        case 'trace_id':
        case 'parent_id':
        case 'transaction_id':
          max = opts.truncateKeywordsAt
          break

        case 'context':
          max = contextLength(path, opts)
          break

        case 'log':
          switch (path[1]) {
            case 'level':
            case 'logger_name':
            case 'param_message':
              max = opts.truncateKeywordsAt
              break

            case 'message':
              if (opts.truncateErrorMessagesAt >= 0) {
                max = opts.truncateErrorMessagesAt
              } else {
                return value
              }
              break
          }
          break

        case 'exception':
          switch (path[1]) {
            case 'type':
            case 'code':
            case 'module':
              max = opts.truncateKeywordsAt
              break
            case 'message':
              if (opts.truncateErrorMessagesAt >= 0) {
                max = opts.truncateErrorMessagesAt
              } else {
                return value
              }
              break
          }
          break
      }

      return truncate(value, max)
    }
  })
}

function truncMetricSet (metricset, opts) {
  return breadthFilter(metricset, {
    onArray,
    onObject,
    onValue (value, key, path) {
      if (typeof value !== 'string') {
        return value
      }

      const max = path[0] === 'tags'
        ? opts.truncateKeywordsAt
        : opts.truncateStringsAt

      return truncate(value, max)
    }
  })
}

function contextLength (path, opts) {
  switch (path[1]) {
    case 'db':
      if (path[2] === 'statement') {
        return opts.truncateQueriesAt
      }
      break

    case 'request':
      switch (path[2]) {
        case 'method':
        case 'http_version':
          return opts.truncateKeywordsAt

        case 'url':
          switch (path[3]) {
            case 'protocol':
            case 'hostname':
            case 'port':
            case 'pathname':
            case 'search':
            case 'hash':
            case 'raw':
            case 'full':
              return opts.truncateKeywordsAt
          }
          break
      }
      break

    case 'user':
      switch (path[2]) {
        case 'id':
        case 'email':
        case 'username':
          return opts.truncateKeywordsAt
      }
      break

    case 'tags':
      return opts.truncateKeywordsAt
  }

  return opts.truncateStringsAt
}

function isHeader (path) {
  return path[0] === 'context' && (path[1] === 'request' || path[1] === 'response') && path[2] === 'headers' && path[3]
}

function onObjectWithHeaders (value, key, path, isNew) {
  if (isHeader(path)) return String(value)
  return onObject(value, key, path, isNew)
}

function onObject (value, key, path, isNew) {
  return isNew ? {} : '[Circular]'
}

function onArray (value, key, path, isNew) {
  return isNew ? [] : '[Circular]'
}

function truncateCustomKeys (value, max, keywords) {
  if (typeof value !== 'object' || value === null) {
    return value
  }
  const result = value
  const keys = Object.keys(result)
  const truncatedKeys = keys.map(k => keywords.includes(k) ? k : truncate(k, max))

  for (const [index, k] of keys.entries()) {
    const value = result[k]
    delete result[k]
    const newKey = truncatedKeys[index]
    result[newKey] = truncateCustomKeys(value, max, keywords)
  }
  return result
}
