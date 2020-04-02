'use strict'

module.exports = ancestors

function ancestors (m) {
  const ancestors = []
  while ((m = m.parent)) {
    ancestors.push(m.filename)
  }
  return ancestors
}
