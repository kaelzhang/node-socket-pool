import {
  Pool as _Pool,
  DefaultEvictor,
  PriorityQueue,
  Deque
} from 'generic-pool'

import Socket from './socket'

import {
  inherits
} from 'util'


export default class extends Pool {
  constructor ({
    // options of generic-pool
    pool,
    connect,
    evictor = DefaultEvictor,
    deque = Deque,
    priorityQueue = PriorityQueue,
    ...socket
  }) {

    super(DefaultEvictor, Deque, PriorityQueue, {
      create () {
        this.emit('factoryCreate')
        return this._createSocket()
      },

      destroy (socket) {
        this.emit('factoryDestroy')
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
