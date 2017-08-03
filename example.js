'use strict'

const createChannel = require('.')

const channel = createChannel()

channel.on('error', console.error)
channel.on('message', (msg, from) => {
	console.log('got a message!', msg, from)
})

channel.on('open', () => {
	setTimeout(() => {
		channel.send({hello: 'friends!'})
	}, 2000)
})
