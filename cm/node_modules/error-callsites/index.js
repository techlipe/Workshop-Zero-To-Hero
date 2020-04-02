'use strict'

const { callsitesSym } = require('./lib/internal/symbols')
const fallback = Error.prepareStackTrace || require('./lib/node-0.10-formatter')

let lastPrepareStackTrace = fallback

Object.defineProperty(Error, 'prepareStackTrace', {
  configurable: true,
  enumerable: true,
  get: function () {
    return prepareStackTrace
  },
  set: function (fn) {
    // Don't set `lastPrepareStackTrace` to ourselves. If we did, we'd end up
    // throwing a RangeError (Maximum call stack size exceeded).
    lastPrepareStackTrace = fn === prepareStackTrace
      ? fallback
      : fn
  }
})

module.exports = function (err) {
  err.stack // eslint-disable-line no-unused-expressions
  return err[callsitesSym]
}

function prepareStackTrace (err, callsites) {
  // If the symbol has already been set it must mean that someone else has also
  // overwritten `Error.prepareStackTrace` and retains a reference to this
  // function that it's calling every time it's own `prepareStackTrace`
  // function is being called. This would create an infinite loop if not
  // handled.
  if (Object.prototype.hasOwnProperty.call(err, callsitesSym)) return fallback(err, callsites)

  Object.defineProperty(err, callsitesSym, {
    enumerable: false,
    configurable: true,
    writable: false,
    value: callsites
  })

  return lastPrepareStackTrace(err, callsites)
}
