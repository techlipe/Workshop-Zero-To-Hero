const awaitEvent = require('await-event')
const socketLocation = require('socket-location')

module.exports = async function httpRequestToUrl (request) {
  if (!request.socket) {
    await awaitEvent(request, 'socket')
  }

  const { socket } = request
  const proto = `http${socket.encrypted ? 's' : ''}:`
  const location = await socketLocation(socket)

  return `${proto}//${location}${request.path}`
}
