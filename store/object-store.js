
import { Emitter } from '/reactive/emitter.js'

export class ObjectStore extends Emitter {
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