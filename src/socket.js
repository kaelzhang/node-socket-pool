import {
  Socket as _Socket
} from 'net'

export default class Socket extends _Socket {
  constructor (options) {
    super(options)
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

  end (...args) {
    this.once('end', () => {
      this._pool.destroy(this)
    })

    super.end(...args)
  }
}
