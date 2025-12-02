
export class MockNode {
	#attributes
	#events

	constructor() {
		this.innerText = ''
		this.#attributes = new Map()
		this.#events = new Map()
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

	callEvent(event) {
		if(!this.#events.has(event)) throw new Error(`Event ${event} not set`)

		const handler = this.#events.get(event)

		if('handleEvent' in handler) {
			handler.handleEvent({})
		}
		else {
			handler({})
		}
	}
}
