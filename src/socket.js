import {
  Socket as _Socket
} from 'net'

import {
  inherits
} from 'util'

import {
  delegate
} from './utils'


export default class Socket {
  constructor (options) {
    this._socket = new _Socket(options)


    this._socket.once('end', () => {
      this._pool.destroy(this)
    })
  }

  connect (config) {
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
    this._pool.release(this)
  }

  destroy () {
    this.removeAllListeners()
    this._socket.destroy()
    this._pool.destroy(this)
  }
}


delegate(Socket, '_socket', [
  'on',
  'removeAllListeners',
  'once',
  'write',
  'end'
])
