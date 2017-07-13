[![Build Status](https://travis-ci.org/kaelzhang/node-persistent-socket.svg?branch=master)](https://travis-ci.org/kaelzhang/node-persistent-socket)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/node-persistent-socket?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/node-persistent-socket)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/persistent-socket.svg)](http://badge.fury.io/js/persistent-socket)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/persistent-socket.svg)](https://www.npmjs.org/package/persistent-socket)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/node-persistent-socket.svg)](https://david-dm.org/kaelzhang/node-persistent-socket)
-->

# persistent-socket

<!-- description -->

## Install

```sh
$ npm install persistent-socket --save
```

## Usage

```js
import Socket from 'persistent-socket'

const socket = new Socket({
  pool: {
    // the options of generic-pool
    max: 100,
    min: 10
  },

  // other options of net.Socket
})

// And then, the usage of `socket` is nearly the same as `new net.Socket`
```

## License

MIT
