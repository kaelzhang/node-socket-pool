import test from 'ava'

import {
  createServer,
  createTasks
} from './lib/utils'

import Pool from '../src'


let port
let client_count = 0
const max = 10
const host = '127.0.0.1'

test.before(async () => {
  const server = await createServer({
    onConnection () {
      client_count ++
    }
  })

  port = server.port
})


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

  const tasks = createTasks(total)
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
  console.log('the max parallel socket is', client_count)
})
