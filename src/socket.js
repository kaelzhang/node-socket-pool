import {
  Socket as _Socket
} from 'net'

export default class Socket extends _Socket {
  constructor (options) {
    super(options)

    this.once('end', () => {
      this._pool.destroy(this)
    })
  }

  release () {
    this.removeAllListeners()
    this._pool.release(this)
  }

  destroy () {
    this.removeAllListeners()
    super.destroy()
    this._pool.destroy(this)
  }
}
