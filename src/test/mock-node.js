
export class MockNode {
	#attributes
	#events
	#checked
	#value = ''

	constructor() {
		this.innerText = ''
		this.type = ''

		this.#attributes = new Map()
		this.#events = new Map()
	}

	// properties

	get value() {
		return this.#value
	}

	set value(value) {
		this.#value = value
		this.dispatchEvent('change', {
			target: {
				value
			}
		})
	}

	get checked() {
		return this.#checked === true
	}

	set checked(checked) {
		this.#checked = checked
		this.dispatchEvent('change', {
			target: {
				checked
			}
		})
	}

	// attributes

	setAttribute(attr, value) {
		this.#attributes.set(attr, value)
	}

	getAttribute(attr) {
		return this.#attributes.has(attr) ? this.#attributes.get(attr) : null
	}

	hasAttribute(attr) {
		return this.#attributes.has(attr)
	}

	removeAttribute(attr) {
		this.#attributes.delete(attr)
	}

	// events

	addEventListener(event, handler) {
		this.#events.set(event, handler)
	}

	dispatchEvent(event, args = {}) {
		if(!this.#events.has(event)) return

		const handler = this.#events.get(event)

		if('handleEvent' in handler) {
			handler.handleEvent(args)
		}
		else {
			handler(args)
		}
	}
}
