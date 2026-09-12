
import { Emittable } from '../utils/emittable.js'
import { getProxy } from './proxy.js'

export class ListStore extends Emittable {
	#data = []
	#key

	constructor(data = [], key = 'id') {
		this.#key = key
		this.#data = data.map(item => getProxy(item, key))
	}

	get all() {
		return this.#data
	}

	add(item) {
		const proxied = getProxy(item, this.#key)

		this.#data.push(proxied)

		this._emitter.emit('add', proxied)
		this._emitter.emit('change:all', 'all', this.#data)

		return item
	}

	addRange(items) {
		items.forEach(item => {
			const proxied = getProxy(item, this.#key)

			this.#data.push(proxied)
			this._emitter.emit('add', proxied)
		})

		this._emitter.emit('change:all', 'all', this.#data)

		return items
	}

	remove(item) {
		const proxied = getProxy(item, this.#key)

		this.#data = this.#data.filter(toRemove => toRemove[this.#key] !== item[this.#key])

		this._emitter.emit('remove', proxied)
		this._emitter.emit('change:all', 'all', this.#data)

		return proxied
	}

	empty() {
		if(this.#data.length === 0) return

		this.#data.forEach(item => {
			const proxied = getProxy(item, this.#key)

			this._emitter.emit('remove', proxied)
		})

		this.#data = []
		this._emitter.emit('change:all', 'all', this.#data)
	}
}
