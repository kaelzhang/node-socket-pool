import {
  Socket as _Socket
} from 'net'

import pTimeout from 'p-timeout'

import {
  delegate
} from './utils'


const isValidTimeout = timeout => typeof timeout === 'number' && timeout > 0

export default class Socket {
  constructor (options) {
    this._socket = new _Socket(options)

    this._destroyed = false
    this._connected = false

    this._socket.once('end', () => this.destroy())
  }

  connect (config, timeout) {
    if (this._connected) {
      return Promise.resolve(this)
    }

    this._connected = true

    const waitForConnected = new Promise((resolve, reject) => {
      this.on('connect', () => {
        // Then remove error listener for reject
        this.removeAllListeners('error')
        resolve(this)
      })

      this.on('error', err => {
        reject(err)
      })

      this._connect(config)
    })

    if (!isValidTimeout(timeout)) {
      return waitForConnected
    }

    return pTimeout(waitForConnected, timeout, '')
  }

  _connect (config) {
    const {
      path
    } = config

    // IPC connection
    if (path) {
      this._socket.connect(path)
      return
    }

    // TCP connection
    this._socket.connect(config)
  }

  release () {
    this.removeAllListeners()

    if (this._pool) {
      this._pool.release(this)
    }
  }

  destroy () {
    if (this._destroyed) {
      return
    }

    this._destroyed = true

    this.removeAllListeners()
    this._socket.destroy()

    if (!this._pool) {
      return
    }

    this._pool.destroy(this)
    this._pool = null
  }
}


delegate(Socket, '_socket', [
  'on',
  'removeAllListeners',
  'once',
  'write',
  'end'
])
