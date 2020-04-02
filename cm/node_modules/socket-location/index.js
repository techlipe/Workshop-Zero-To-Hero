const awaitEvent = require('await-event')

module.exports = async function remoteSocketLocation (socket) {
  if (socket.connecting) {
    await awaitEvent(socket, 'connect')
  }

  const { remoteAddress, remotePort } = socket
  return `${remoteAddress}:${remotePort}`
}
