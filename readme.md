# multicast-channel

**A simple communication channel using [UDP](https://en.wikipedia.org/wiki/User_Datagram_Protocol) [multicast](https://en.wikipedia.org/wiki/IP_multicast).** Node.js only. Send an receive anything `JSON.stringify`-able.

Similar to [`multicast`](https://github.com/ForbesLindesay-Unmaintained/multicast). The code is heavily inspired by [`multicast-dns`](https://github.com/mafintosh/multicast-dns).

[![npm version](https://img.shields.io/npm/v/multicast-channel.svg)](https://www.npmjs.com/package/multicast-channel)
[![build status](https://img.shields.io/travis/derhuerst/multicast-channel.svg)](https://travis-ci.org/derhuerst/multicast-channel)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/multicast-channel.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)


## Installing

```shell
npm install multicast-channel
```


## Usage

```js
const createChannel = require('multicast-channel')

const channel = createChannel()

channel.on('error', console.error)
channel.on('message', (msg, from) => {
	console.log('got a message!', msg, from)
})

channel.on('open', () => {
	channel.send({hello: 'friends!'})
})
```


## Contributing

If you have a question or have difficulties using `multicast-channel`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/multicast-channel/issues).
