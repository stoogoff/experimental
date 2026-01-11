
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

	addRange(items) {
		items.forEach(item => {
			const proxied = getProxy(item, this.#key)

			this.#data.add(proxied)
			this.#emitter.emit('add', proxied)
		})

		this.#emitter.emit('change:all', 'all', this.all)

		return items
	}

	remove(item) {
		const proxied = getProxy(item, this.#key)

		this.#data.delete(proxied)

		this.#emitter.emit('remove', proxied)
		this.#emitter.emit('change:all', 'all', this.all)

		return proxied
	}

	empty() {
		if(this.#data.size === 0) return

		this.#data.forEach(item => {
			const proxied = getProxy(item, this.#key)

			this.#emitter.emit('remove', proxied)
		})

		this.#data = new Set()
		this.#emitter.emit('change:all', 'all', this.all)
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
