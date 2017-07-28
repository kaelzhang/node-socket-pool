import {
  Socket
} from 'net'

import {
  inherits
} from 'util'


export default class extends Socket {
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
