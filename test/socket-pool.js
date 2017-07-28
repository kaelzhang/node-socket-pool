import test from 'ava'
import {
  createServer
} from 'net'

import getPort from 'get-port'

import Pool from '..'


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
        client_count ++
      })

      socket.on('data', (data) => {
        setTimeout(() => {
          socket.write(data)
          socket.write(END)
        }, 5)
      })
    })

    server.listen(port, () => {
      resolve()
    })
  })
})


function create_tasks (n) {
  const arr = []
  arr.length = n
  return arr
}


test('basic', async t => {
  const pool = new Pool({})
  //
  // pool.on('factoryCreate', () => {
  //   t.is(client_count < max, true, 'max client exceeded')
  // })
  //
  // const tasks = create_tasks(20)
  // .map(async x => {
  //   const socket = await pool.acquire()
  //   const data = 'hello'
  //
  //   return new Promise(resolve => {
  //     socket.on('data', (chunk) => {
  //       if (chunk === END) {
  //         socket.release()
  //         return
  //       }
  //
  //       t.is(chunk, data, 'data not match')
  //     })
  //
  //     socket.write(data)
  //   })
  //
  // })
  //
  // await Promise.all(tasks)
})
