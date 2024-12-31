
import { Emitter } from '/reactive/emitter.js'
import { notNull } from '/utils/assert.js'
import { max } from '/utils/list.js'

export class CollectionStore extends Emitter {
	#data = []

	constructor(data, nextId) {
		super()

		this.#data = data

		if(notNull(nextId)) {
			this.nextId = nextId
		}
	}

	nextId() {
		return this.#data.map(({ id }) => id).reduce(max, 0) + 1
	}

	all() {
		return this.#data
	}

	add(item) {
		const nextId = this.nextId()
		const newItem = { ...item, id: nextId }

		this.#data = [ ...this.#data, newItem ]

		this.emit('add', newItem)
		this.emit('change', this.#data)

		return newItem
	}

	remove(item) {
		this.#data = this.#data.filter(({ id }) => id !== item.id)

		this.emit('remove', item)
		this.emit('change', this.#data)

		return item
	}
}
