
import { Emitter } from '/reactive/emitter.js'

const max = (a, c) => Math.max(a, c)

class Store extends Emitter {
	#data

	constructor(data) {
		super()

		this.#data = data
	}

	all() {
		return this.#data
	}

	add(item) {
		const nextId = this.#data.map(({ id }) => id).reduce(max, 0) + 1
		const newItem = { ...item, id: nextId }

		this.#data = [ ...this.#data, newItem ]

		this.emit('add', newItem)
		this.emit('change', this.#data)

		return newItem
	}

	remove(item) {
		this.#data =  this.#data.filter(({ id }) => id !== item.id)

		this.emit('remove', item)
		this.emit('change', this.#data)

		return item
	}
}


export const store = new Store([{ id: 1, text: 'Cooking', done: false }])
