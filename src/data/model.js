
import { Emitter } from '../utils/emitter.js'

/**
 * Proxies any model by returning a Proxy of the target object. Adds
 * on / off handlers from the Emitter class and automatically emits
 * `change` and `change:<property>` events when a property is modified.
 */
export class ProxiedModel {
	#model
	#emitter = new Emitter()

	/**
	 * Constructor.
	 * @param {Object} model - the object to proxy for.
	 * @return {Proxy} a Proxy instance
	 */
	constructor(model) {
		this.#model = model
		
		const proxy = new Proxy(model, this)

		proxy.on = this.on.bind(this)
		proxy.off = this.off.bind(this)
		proxy.clear = this.clear.bind(this)

		return proxy
	}

	// Proxy methods

	/**
	 * Interceptor method for accessing properties from the original model.
	 * Returns either the property value from the model or the model itself
	 * for the special property `model`.
	 * @example
	 * const data = { hello: 'World' }
	 * const proxiedModel = new ProxiedModel(data)
	 * console.log(proxiedModel.hello) // outputs 'World'
	 * console.log(proxiedModel.model) // outputs the `data`
	 * @param {Object} target - the proxied model
	 * @param {string} prop - the property
	 * @param {Object} receiver
	 * @return {*}
	 */
	get(target, prop, receiver) {
		if(prop === 'model') {
			return this.#model
		}

		return target[prop]
	}

	/**
	 * Sets a property on the model and fires appropriate events. Throws an error
	 * if attempting to set the special 'model' property.
	 * @example
	 * const data = { hello: 'World' }
	 * const proxiedModel = new ProxiedModel(data)
	 * proxiedModel.hello = 'Venus'
	 * // emits the following events with parameters
	 * // 'change' -> 'hello', 'Venus', 'World'
	 * // 'change:hello' -> 'hello', 'Venus', 'World'
	 * @param {Object} target  - the proxied model
	 * @param {string} prop - the property to change
	 * @param {*} value - the value to set the property to
	 * @return {boolean}
	 */
	set(target, prop, value) {
		if(prop === 'model') return false

		const oldValue = target[prop]

		if(oldValue === value) return true

		target[prop] = value

		this.#emitter.emit('change', prop, value, oldValue)
		this.#emitter.emit(`change:${prop}`, prop, value, oldValue)

		return true
	}

	// Emitter methods

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
