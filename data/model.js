
import { Emitter } from '../reactive/emitter.js'

export class ProxiedModel {
	#model
	#emitter = new Emitter()

	constructor(model) {
		this.#model = model
		
		const proxy = new Proxy(model, this)

		proxy.on = this.on.bind(this)
		proxy.off = this.off.bind(this)
		proxy.clear = this.clear.bind(this)

		return proxy
	}

	// proxy methods
	get(target, prop, receiver) {
		if(prop === 'model') {
			return this.#model
		}

		return target[prop]
	}

	set(target, prop, value) {
		const oldValue = target[prop]

		if(oldValue === value) return true

		target[prop] = value

		this.#emitter.emit('change', prop, value, oldValue)
		this.#emitter.emit(`change:${prop}`, prop, value, oldValue)

		return true
	}

	on(event, callback) {
		return this.#emitter.on(event, callback)
	}

	off(event, reference) {
		return this.#emitter.off(event, reference)
	}

	clear() {
		this.#emitter.clear()
	}
}
