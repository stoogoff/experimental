
export class Signal extends EventTarget {
	#value

	constructor(value) {
		super()
		this.#value = value
	}

	get value() {
		return this.#value
	}

	set value(newValue) {
		if(this.value === newValue) return

		this.#value = newValue
		this.dispatchEvent(new CustomEvent('change', {
			detail: {
				value: this.value,
			},
		}))
	}

	on(fn) {
		this.addEventListener('change', fn)

		return () => this.removeEventListener('change', fn)
	}

	valueOf() {
		return this.value
	}

	toString() {
		return String(this.value)
	}
}

export const signal = value => new Signal(value)
