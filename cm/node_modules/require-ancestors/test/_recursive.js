'use strict'

const ancestors = require('../')

exports.recursive = require('./_recursive2')
exports.ancestors = ancestors(module)
