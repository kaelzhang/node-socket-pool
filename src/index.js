import {
  Pool as _Pool,
  DefaultEvictor,
  PriorityQueue,
  Deque
} from 'generic-pool'
import Socket from './socket'

export class Pool extends _Pool {
  constructor ({
    // options of generic-pool
    pool,
    connect,
    ...socket
  }) {

    super(DefaultEvictor, Deque, PriorityQueue, {
      create () {
        return this._createSocket()
      },

      destroy (socket) {
        return this._destroySocket()
      }
    }, pool)

    // allowHalfOpen defaults to true
    socket.allowHalfOpen = socket.allowHalfOpen === false
      ? false
      : true

    this._socketOptions = socket
    this._connectOptions = connect
  }

  _createSocket () {
    const socket = new Socket()
    const options = this._connectOptions

    return new Promise((resolve, reject) => {
      socket.on('connect', () => {
        // Then remove error listener for reject
        socket.removeAllListeners('error')

        resolve()
      })

      socket.on('error', err => {
        reject(err)
      })

      socket.connect(this._connectOptions)
    })
  }

  _destroySocket (socket) {
    socket._pool = null
  }
}
