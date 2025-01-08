
import { Emitter } from '../reactive/emitter.js'

export class CollectionStore extends Emitter {
	#data = []
	#mapFrom = item => item

	constructor(data, map) {
		super()

		if(map) this.#mapFrom = map

		this.#data = data.map(clock => this.#mapFrom(clock))
	}

	all() {
		return this.#data
	}

	add(item) {
		const converted = this.#mapFrom(item)

		this.#data = [ ...this.#data, converted ]

		this.emit('add', converted)
		this.emit('change', this.#data)

		return converted
	}

	update(item) {
		const converted = this.#mapFrom(item)
		const index = this.#data.map(({ id }) => id).indexOf(converted.id)

		if(index > -1) {
			this.#data[index] = converted

			this.emit('update', converted)
			this.emit('change', this.#data)
		}
		else {
			this.add(item)
		}

		return converted
	}

	remove(item) {
		const converted = this.#mapFrom(item)

		this.#data = this.#data.filter(({ id }) => id !== converted.id)

		this.emit('remove', converted)
		this.emit('change', this.#data)

		return converted
	}
}
