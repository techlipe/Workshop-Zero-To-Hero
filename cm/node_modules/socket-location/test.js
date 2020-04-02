const { promisify } = require('util')
const net = require('net')
const tap = require('tap')
const awaitEvent = require('await-event')
const socketLocation = require('./')

tap.test('before connect', async t => {
  const { port, close } = await makeServer()
  t.on('end', close)

  const client = net.connect(port)
  t.on('end', () => client.destroy())

  const location = await socketLocation(client)
  t.equal(location, `127.0.0.1:${port}`)
  t.end()
})

tap.test('after connect', async t => {
  const { port, close } = await makeServer()
  t.on('end', close)

  const client = net.connect(port)
  t.on('end', () => client.destroy())

  await awaitEvent(client, 'connect')

  const location = await socketLocation(client)
  t.equal(location, `127.0.0.1:${port}`)
  t.end()
})

function makeServer () {
  return new Promise(resolve => {
    const server = net.createServer(socket => {
      socket.end('hello')
      socket.destroy()
    })

    server.listen(0, '0.0.0.0', () => {
      resolve({
        port: server.address().port,
        close: promisify(server.close.bind(server))
      })
    })
  })
}
