
import { Emitter } from '../utils/emitter.js'
import { getProxy } from './proxy.js'

export class SetStore {
	#data
	#key
	#emitter

	constructor(data = [], key = 'id') {
		this.#emitter = new Emitter()
		this.#key = key
		this.#data = new Set(data.map(item => getProxy(item, key)))
	}

	get all() {
		return Array.from(this.#data.values())
	}

	add(item) {
		const proxied = getProxy(item, this.#key)

		this.#data.add(proxied)

		this.#emitter.emit('add', proxied)
		this.#emitter.emit('change:all', 'all', this.all)

		return item
	}

	remove(item) {
		const proxied = getProxy(item, this.#key)

		this.#data.delete(proxied)

		this.#emitter.emit('remove', proxied)
		this.#emitter.emit('change:all', 'all', this.all)

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
