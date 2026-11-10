
import { Signal } from './signal.js'

export class Model extends EventTarget {
	constructor(data) {
		super()

		Object.keys(data).forEach(prop => {
			this[prop] = new Signal(data[prop])
			this[prop].on(({ detail }) => {
				this.dispatchEvent(new CustomEvent('change', {
					detail: {
						model: this,
					}
				}))
				this.dispatchEvent(new CustomEvent(`change:${prop}`, {
					detail: {
						value: detail.value,
					}
				}))
			})
		})
	}

	on(fn, property) {
		const event = property ? `change:${property}` : 'change'

		this.addEventListener(event, fn)

		return () => this.removeEventListener(event, fn)
	}
}
