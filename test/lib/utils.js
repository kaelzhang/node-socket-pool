import {
  createServer as _createSocket
} from 'net'

import getPort from 'get-port'


export {
  getPort
}

export const createServer = async ({
  port,
  onConnection
}) => {
  port = port || await getPort()

  return new Promise((resolve, reject) => {
    const server = _createSocket(socket => {

      onConnection(socket)

      socket.on('data', data => {
        socket.write(data)
      })
    })

    server.listen(port, () => {
      resolve({
        port
      })
    })
  })
}


export const createTasks = n => {
  const arr = []
  while (n -- > 0) {
    arr[n] = 1
  }

  return arr
}
