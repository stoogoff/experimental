
import { Emitter } from '../utils/emitter.js'
import { getProxy } from './proxy.js'

export class SetStore extends Emitter {
	#data
	#key

	constructor(data = [], key = 'id') {
		super()

		this.#key = key
		this.#data = new Set(data.map(item => getProxy(item, key)))
	}

	get all() {
		return Array.from(this.#data.values())
	}

	add(item) {
		const proxied = getProxy(item, this.#key)

		this.#data.add(proxied)

		this.emit('add', proxied)
		this.emit('change:all', 'all', this.#data)

		return item
	}

	remove(item) {
		const proxied = getProxy(item, this.#key)

		this.#data = this.#data.delete(proxied)

		this.emit('remove', proxied)
		this.emit('change:all', 'all', this.#data)

		return proxied
	}
}
