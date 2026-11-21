
import { Signal } from './signal.js'
import { ChangeEvent, PropertyEvent } from './events.js'

export class Model extends EventTarget {
	constructor(data) {
		super()

		Object.keys(data).forEach(prop => {
			this[prop] = new Signal(data[prop])
			this[prop].on(({ detail }) => {
				this.dispatchEvent(new ChangeEvent(this))
				this.dispatchEvent(new PropertyEvent(prop, detail.value))
			})
		})
	}

	on(fn, property) {
		const event = property ? PropertyEvent.EventKey(property) : ChangeEvent.EventKey

		this.addEventListener(event, fn)

		return () => this.removeEventListener(event, fn)
	}
}

export const model = data => new Model(data)
