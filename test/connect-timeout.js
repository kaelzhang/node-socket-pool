import test from 'ava'

import {
  getPort
} from './lib/utils'

import Pool from '../src'


const max = 10
const host = '127.0.0.1'
let client_count = 0

test('socket error', async t => {
  const timeout = 1000
  const port = await getPort()

  const pool = new Pool({
    connect: {
      host,
      port
    },
    connectTimeout: timeout,
    pool: {
      max,
      min: 1
    }
  })

  return pool.acquire()
  .then(() => {
    t.fail('should timeout')
  })
  .catch(err => {
    t.is(err.name, 'SocketError')
  })
})
