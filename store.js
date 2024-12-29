
import { Emitter } from '/reactive/emitter.js'
import { CollectionStore } from '/reactive/store.js'

export const todoStore = new CollectionStore([{ id: 1, text: 'Cooking', done: false }])

class ObjectStore extends Emitter {
	constructor(data) {
		super()

		Object.keys(data).forEach(key => {
			Object.defineProperty(this, key, {
				get() {
					return data[key]
				},

				set(newValue) {
					const oldValue = data[key]

					if(oldValue === newValue) return

					data[key] = newValue

					this.emit('change', key, newValue, oldValue)
					this.emit(`change:${key}`, key, newValue, oldValue)
				},
			}) 
		})
	}
}

export const personStore = new ObjectStore({
	firstName: 'Stoo',
	lastName: 'Goff',
	age: 49,
})
