import test from 'ava'
import {
  createServer
} from 'net'

import getPort from 'get-port'

import Pool from '../src'

let server
let port
let client_count = 0
const max = 10
const host = '127.0.0.1'
const END = 'END'

test.before(async () => {
  port = await getPort()

  return new Promise((resolve, reject) => {
    server = createServer(socket => {
      client_count ++

      socket.on('data', data => {
        socket.write(data)
      })
    })

    server.listen(port, () => {
      resolve()
    })
  })
})


function create_tasks (n) {
  const arr = []
  while (n -- > 0) {
    arr[n] = 1
  }

  return arr
}


test('basic', async t => {
  const pool = new Pool({
    connect: {
      host,
      port
    },
    pool: {
      max,
      min: 1
    }
  })

  const total = 30
  let count = 0

  pool.on('factoryCreate', () => {
    t.is(client_count <= max, true, 'max client exceeded')
  })

  const tasks = create_tasks(30)
  .map(async x => {
    const socket = await pool.acquire()
    const data = 'hello'

    return new Promise(resolve => {
      socket.on('data', (chunk) => {
        chunk = chunk.toString()
        t.is(chunk, data, 'data not match')

        count ++
        socket.release()
        resolve()
      })

      socket.write(data)
    })

  })

  await Promise.all(tasks)
  t.is(count, total, 'some task not completed')
})
