import {
  createPool
} from 'generic-pool'

import {
  inherits
} from 'util'

import Socket from './socket'

import {
  delegate
} from './utils'


export default class Pool {
  constructor ({
    // options of generic-pool
    pool,
    connect,
    ...socket
  }) {

    // allowHalfOpen defaults to true
    socket.allowHalfOpen = socket.allowHalfOpen === false
      ? false
      : true

    this._socketOptions = socket
    this._connectOptions = connect

    this._pool = createPool({
      create () {
        this.emit('factoryCreate')
        return this._createSocket()
      },

      destroy (socket) {
        this.emit('factoryDestroy')
        return this._destroySocket()
      }
    }, pool)
  }

  _createSocket () {
    const socket = new Socket(this._socketOptions)
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


delegate(Pool, 'acquire', '_pool')
delegate(Pool, 'drain', '_pool')
delegate(Pool, 'destroy', '_pool')
delegate(Pool, 'release', '_pool')
