'use strict'

const {EventEmitter} = require('events')
const randomString = require('crypto-random-string')
const {createSocket} = require('dgram')

// todo: udp6 support
const GROUP = '224.0.0.120' // IP multicast group to subscribe & send to
const INTERFACE = '0.0.0.0' // all interfaces
const PORT = 5555

const noop = () => {}

const defaults = {
	pack: (content, from) => {
		return Buffer.from(JSON.stringify({content, from}), 'utf8')
	},
	unpack: (data) => {
		try {
			data = JSON.parse(data.toString('utf8'))
		} catch (err) {
			throw new Error('non-JSON message')
		}
		if (!('from' in data)) throw new Error('message without sender ID')
		if (!('content' in data)) throw new Error('message without content')
		return data
	}
}

const createChannel = (opt = {}) => {
	opt = Object.assign({}, defaults, opt)

	const channel = new EventEmitter()
	const id = channel.id = randomString(8)
	let me = {address: GROUP, port: PORT}

	const onError = (err) => {
		if (err.code === 'EACCESS' || err.core === 'EADDRINUSE') channel.emit('error', err)
		else channel.emit('warning', err)
	}

	const onListening = () => {
		me = socket.address()

		try {
			socket.addMembership(GROUP, INTERFACE)
		} catch (err) {
			channel.emit('error', err)
		}
		socket.setMulticastTTL(10)
		socket.setMulticastLoopback(true)

		channel.emit('open', me)
	}

	const onMessage = (data, info) => {
		try {
			data = opt.unpack(data)
		} catch (err) {
			return channel.emit('warning', err)
		}

		if (data.from === id) return // ignore own messages
		channel.emit('message', data.content, data.from)
	}

	const createSend = (address, port) => {
		const send = (msg, cb = noop) => {
			const data = opt.pack(msg, id)
			socket.send(data, 0, data.byteLength, port, address, cb)
		}
		return send
	}

	// todo: udp6 support
	const socket = createSocket({
		type: 'udp4',
		reuseAddr: true,
		toString: () => 'udp4'
	})

	socket.on('error', onError)
	socket.on('message', onMessage)
	socket.bind(PORT, INTERFACE, onListening)

	channel.send = createSend(GROUP, me.port)
	return channel
}

module.exports = createChannel
