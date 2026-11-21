
import { throwIfNull } from '../utils/assert.js'
import { createId } from '../utils/string.js'
import { AddEvent, ChangeEvent, RemoveEvent } from './events.js'

const mapItem = item => ({ ...item, _id: item._id ?? createId(12) })

export class List extends EventTarget {
	#data = {}

	constructor(data) {
		super()

		data.map(mapItem).forEach(item => {
			this.#data[item._id] = item
		})
	}

	get all() {
		return Object.values(this.#data)
	}

	set(items) {
		items.forEach(item => {
			const model = mapItem(item)

			this.#data[model._id] = model
		})

		this.dispatchEvent(new ChangeEvent(this.all))
	}

	add(item) {
		const model = mapItem(item)

		this.#data[model._id] = model

		this.dispatchEvent(new AddEvent(model))
		this.dispatchEvent(new ChangeEvent(this.all))

		return model
	}

	remove(item) {
		throwIfNull(item._id)

		delete this.#data[item._id]

		this.dispatchEvent(new RemoveEvent(item))
		this.dispatchEvent(new ChangeEvent(this.all))

		return item
	}

	get(id) {
		throwIfNull(id)

		return id in this.#data ? this.#data[id] : null
	}

	on(fn, eventKey = ChangeEvent.EventKey) {
		this.addEventListener(eventKey, fn)

		return () => this.removeEventListener(eventKey, fn)
	}

	valueOf() {
		return this.all
	}

	toString() {
		return String(this.all)
	}
}

export const list = data => new List(data)
