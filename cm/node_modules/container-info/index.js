'use strict'

const fs = require('fs')

const uuidSource = '[0-9a-f]{8}[-_][0-9a-f]{4}[-_][0-9a-f]{4}[-_][0-9a-f]{4}[-_][0-9a-f]{12}'
const containerSource = '[0-9a-f]{64}'

const lineReg = /^(\d+):([^:]*):(.+)$/
const podReg = new RegExp(`pod(${uuidSource})(?:.slice)?$`)
const containerReg = new RegExp(`(${uuidSource}|${containerSource})(?:.scope)?$`)

function parseLine (line) {
  const [ id, groups, path ] = (line.match(lineReg) || []).slice(1)
  const data = { id, groups, path }
  const parts = path.split('/')

  const controllers = groups.split(',')
  if (controllers) data.controllers = controllers

  const containerId = (parts.pop().match(containerReg) || [])[1]
  if (containerId) data.containerId = containerId

  const podId = (parts.pop().match(podReg) || [])[1]
  if (podId) data.podId = podId

  return data
}

function parse (contents) {
  const data = {
    entries: []
  }

  for (let line of contents.split('\n')) {
    line = line.trim()
    if (line) {
      const lineData = parseLine(line)
      data.entries.push(lineData)
      if (lineData.containerId) {
        data.containerId = lineData.containerId
      }
      if (lineData.podId) {
        data.podId = lineData.podId
      }
    }
  }

  return data
}

function containerInfo (pid = 'self') {
  return new Promise((resolve) => {
    fs.readFile(`/proc/${pid}/cgroup`, (err, data) => {
      resolve(err ? undefined : parse(data.toString()))
    })
  })
}

function containerInfoSync (pid = 'self') {
  try {
    const data = fs.readFileSync(`/proc/${pid}/cgroup`)
    return parse(data.toString())
  } catch (err) {}
}

module.exports = containerInfo
containerInfo.sync = containerInfoSync
containerInfo.parse = parse
