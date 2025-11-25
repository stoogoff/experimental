
import { Emitter } from '../utils/emitter.js'
import { getProxy } from './proxy.js'

export class ListStore {
	#data = []
	#key
	#emitter

	constructor(data = [], key = 'id') {
		this.#emitter = new Emitter()
		this.#key = key
		this.#data = data.map(item => getProxy(item, key))
	}

	get all() {
		return this.#data
	}

	add(item) {
		const proxied = getProxy(item, this.#key)

		this.#data.push(proxied)

		this.#emitter.emit('add', proxied)
		this.#emitter.emit('change:all', 'all', this.#data)

		return item
	}

	remove(item) {
		const proxied = getProxy(item, this.#key)

		this.#data = this.#data.filter(toRemove => toRemove[this.#key] !== item[this.#key])

		this.#emitter.emit('remove', proxied)
		this.#emitter.emit('change:all', 'all', this.#data)

		return proxied
	}

	// Emitter methods

	on(event, callback) {
		return this.#emitter.on(event, callback)
	}

	off(event, reference) {
		return this.#emitter.off(event, reference)
	}

	clear() {
		this.#emitter.clear()
	}
}
