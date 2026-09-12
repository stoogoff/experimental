
import { Emittable } from '../utils/emittable.js'
import { getProxy } from './proxy.js'

export class SetStore extends Emittable {
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

		this._emitter.emit('add', proxied)
		this._emitter.emit('change:all', 'all', this.all)

		return item
	}

	addRange(items) {
		items.forEach(item => {
			const proxied = getProxy(item, this.#key)

			this.#data.add(proxied)
			this._emitter.emit('add', proxied)
		})

		this._emitter.emit('change:all', 'all', this.all)

		return items
	}

	remove(item) {
		const proxied = getProxy(item, this.#key)

		this.#data.delete(proxied)

		this._emitter.emit('remove', proxied)
		this._emitter.emit('change:all', 'all', this.all)

		return proxied
	}

	empty() {
		if(this.#data.size === 0) return

		this.#data.forEach(item => {
			const proxied = getProxy(item, this.#key)

			this._emitter.emit('remove', proxied)
		})

		this.#data = new Set()
		this._emitter.emit('change:all', 'all', this.all)
	}
}
