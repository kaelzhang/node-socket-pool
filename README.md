[![Build Status](https://travis-ci.org/kaelzhang/node-socket-pool.svg?branch=master)](https://travis-ci.org/kaelzhang/node-socket-pool)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/node-socket-pool?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/node-socket-pool)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/socket-pool.svg)](http://badge.fury.io/js/socket-pool)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/socket-pool.svg)](https://www.npmjs.org/package/socket-pool)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/node-socket-pool.svg)](https://david-dm.org/kaelzhang/node-socket-pool)
-->

# socket-pool

<!-- description -->

## Install

```sh
$ npm install socket-pool --save
```

## Usage

```js
import Pool from 'socket-pool'

const pool = new Pool({
  connect: {
    host: 'localhost',
    port: 2181
  },

  pool: {
    // the options of generic-pool
    max: 100,
    min: 10
  }

  // other options of net.Socket
})

pool.acquire()
.then(socket => {
  socket.on('data', chunk => {
    // concat chunks

    if (dataFinished) {
      // Release the socket resource,
      // then it can be required again.
      socket.release()
    }
  })
})

// And then, the usage of `socket` is nearly the same as `new net.Socket`
```

## new Pool({connect, pool, ...socketOptions})

- **pool** `Object` the options of [`generic-pool`](https://www.npmjs.com/package/generic-pool), and the value is simply passed
- **socketOptions** `Object` the options of `new net.Socket(options)` of the vanilla node.js. The only difference is that the option `socketOptions.allowHalfOpen` defaults to `true`. If half-opened TCP connections are not allowed, `allowHalfOpen` should be explicit set to `false`. But setting this to `false` is kind of silly, since that's the whole purpose of this lib.

### option: connect `Object`

If `connect.path` is specified, then other socket options will be ignored, and it is only for IPC connections.

- **path** `String` the same argument of `socket.connect(path)` of the vanilla node.js

Otherwise, it is for TCP connections, available options are:

- **port**
- **host**
- **localAddress**
- **localPort**
- **family**
- **hints**
- **lookup**

## pool.acquire()

Returns `Promise`.

```js
poo.acquire().then(socket => {
  // do something with socket
})
```

The acquired socket is a wrapped `net.Socket` instance, and only the following methods and events are available

## socket.release()

The `socket-pool`-specified method to release the socket to the pool

## License

MIT
