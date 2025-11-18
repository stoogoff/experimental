
import { Emitter } from '../reactive/emitter.js'
import { getProxy } from './index.js'

export class ListStore extends Emitter {
	#data = []
	#key

	constructor(data = [], key = 'id') {
		super()

		this.#key = key
		this.#data = data.map(item => getProxy(item, key))
	}

	get all() {
		return this.#data
	}

	add(item) {
		const proxied = getProxy(item, this.#key)

		this.#data.push(proxied)

		this.emit('add', proxied)
		this.emit('change:all', 'all', this.#data)

		return item
	}

	remove(item) {
		const proxied = getProxy(item, this.#key)

		this.#data = this.#data.filter(toRemove => toRemove[this.#key] !== item[this.#key])

		this.emit('remove', proxied)
		this.emit('change:all', 'all', this.#data)

		return proxied
	}
}
