
export class MockNode {
	#attributes

	constructor() {
		this.innerText = ''
		this.#attributes = new Map()
	}

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
}
