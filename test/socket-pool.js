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
      socket.on('connect', () => {
        console.log('sockect connect', client_count)
        client_count ++
      })

      socket.on('data', data => {
        setTimeout(() => {
          socket.write(data)
          socket.write(END)
        }, 5)
      })
    })

    server.listen(port, () => {
      console.log(`listened to ${port}`)
      resolve()
    })
  })
})


function create_tasks (n) {
  const arr = []
  while (n -- > 0) {
    arr[n] = 1
  }

  console.log('tasks count:', arr.length)
  return arr
}


test('basic', async t => {
  const pool = new Pool({
    connect: {
      host: '127.0.0.1',
      port
    }
  })

  pool.on('factoryCreate', () => {
    t.is(client_count < max, true, 'max client exceeded')
  })

  const tasks = create_tasks(20)
  .map(async x => {
    const socket = await pool.acquire()
    const data = 'hello'

    return new Promise(resolve => {
      socket.on('data', (chunk) => {
        if (chunk === END) {
          socket.release()
          resolve()
          return
        }

        t.is(chunk, data, 'data not match')
      })

      socket.write(data)
    })

  })

  await Promise.all(tasks)
})
