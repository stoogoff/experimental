
import { logger } from './config.js'
import { isIn, isFunction, notFunction, isNull, throwIfNull } from '../utils/assert.js'
import { valueFromPath } from '../utils/string.js'

let contextRefs = 0

/**
 * Context stores the current scope information, the HTML node which is being
 * operated on, and the render function which will be updated if the scope
 * is changed.
 */ 
export class Context {
	#node
	#property
	#scope
	#callback
	#isInvertedProperty = false
	#stores

	// TMP
	#ref

	/**
	 * Constructor.
	 * @param {HTMLNode} node
	 * @param {string} property
	 * @param {} scope
	 * @param {} callback
	 * @param {} stores
	 */
	constructor(node, property, scope, callback, stores) {
		throwIfNull(node, 'node')
		throwIfNull(property, 'property')
		throwIfNull(scope, 'scope')
		throwIfNull(callback, 'callback')

		if(notFunction(callback)) {
			throw new Error('callback must be a function', callback)
		}

		this.#isInvertedProperty = property.startsWith('!')

		this.#node = node
		this.#property = property.replace(/^!/, '')
		this.#scope = scope
		this.#callback = callback
		this.#stores = stores

		this.#ref = ++contextRefs
	}

	get ref() {
		return this.#ref
	}

	/**
	 * Returns true if the property is boolean and should be treated as a negative value.
	 * @return {boolean}
	 */
	get isInvertedProperty() {
		return this.#isInvertedProperty
	}

	/**
	 * The HTML node which changes are being applied to.
	 * @return {HTMLNode} The HTML node.
	 */
	get node() {
		return this.#node
	}

	/**
	 * The scope context is aware of.
	 * @return {Object} The scope.
	 */
	get scope() {
		return this.#scope
	}

	/**
	 * The property name that is being watched by this context.
	 * @return {string} The property name.
	 */
	get property() {
		return this.#property
	}

	/**
	 * Return the value of the watched property within the scope. This checks
	 * for the existance of the property on the scope object directly and
	 * on a data object within the scope, if the scope has one.
	 * @return {* | undefined} The value of the property, or undefined if it
	 * can't be found.
	 */
	get #rawValue() {
		try {
			const { value } = this.#property.startsWith('stores.')
				? valueFromPath(this.#property, { stores: this.#stores }, true)
				: valueFromPath(this.#property, this.#scope, true)

			return value
		}
		catch(ex) {
			logger().error(ex.message)
		}

		logger().warn(`Unable to find property '${ this.#property }'`, this.#scope)

		return undefined
	}

	/**
	 * Get the raw value and return it. If it's a function call it first.
	 */
	get value() {
		const value = this.#rawValue

		if(isFunction(value)) {
			return value.call(this.#scope, this)
		}

		return value
	}

	/**
	 * Set the value of the property that is being watched by this context on its
	 * underlying scope object. The context sets the value on a data object if one
	 * exists on the scope or directly on the scope itself.
	 * @param {*} value
	 */
	set value(value) {
		let scope = null

		try {
			const { stack } = valueFromPath(this.#property, this.#scope, true)
			const object = stack[stack.length - 2].value
			const path = stack[stack.length - 1].path

			// TODO this has no way of updating the UI as it doesn't fire a change event
			// TODO it could be that context is an emittable...
			scope = object[path]
		}
		catch(ex) {
			logger().error(ex.message)
		}

		if(isNull(scope)) {
			logger().error(`Unable to set property '${ this.#property }' to value '${ value }'`, this.#scope)
		}
		else if(isFunction(scope)) {
			// TODO this will also need to update somehow
			scope.call(this.#scope, this, value)
		}
		else {
			// TODO this needs to update
			scope = value
		}
	}

	/**
	 * Update the HTML Node using the callback function provided in the constructor.
	 * @return {boolean}
	 */
	render() {
		return this.#callback(this)
	}

	/**
	 * Implement handleEvent for passing a Context instance directly
	 * to `addEventListener`.
	 */
	handleEvent(evt) {
		let value = this.#rawValue

		if(!isFunction(value)) {
			logger().error(`Unable to call function '${ this.#property }'`)
			return
		}

		// bind the value to the scope
		//value = value.bind(this.#scope)
		//value(evt, this)
		value.call(this.#scope, evt, this)
	}
}
