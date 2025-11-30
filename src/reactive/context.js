
import { logger } from './config.js'
import { isIn, notFunction, throwIfNull } from '../utils/assert.js'

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

	/**
	 * Constructor.
	 * @param {HTMLNode} node
	 * @param {string} property
	 * @param {} scope
	 * @param {} callback
	 */
	constructor(node, property, scope, callback) {
		throwIfNull(node, 'node')
		throwIfNull(property, 'property')
		throwIfNull(scope, 'scope')
		throwIfNull(callback, 'callback')

		if(notFunction(callback)) {
			throw new Error('callback must be a function', callback)
		}

		this.#node = node
		this.#property = property
		this.#scope = scope
		this.#callback = callback
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

	// TODO value needs to handle the slight differences between
	// component (has a data property for some things) and stores
	// probably component should be changed to match stores
	// this also needs to be aware of parent scopes so something like
	//
	// <div data-q-component="comp">
	// 	<div data-q-store="store">
	// 		<span data-q-click="clickHandler"></span> <-- comp.clickHandler
	// 	</div>
	// </div>
	// will have access to component's methods

	/**
	 * Return the value of the watched property within the scope. This checks
	 * for the existance of the property on the scope object directly and
	 * on a data object within the scope, if the scope has one.
	 * @return {* | undefined} The value of the property, or undefined if it
	 * can't be found.
	 */
	get value() {
		if(isIn('data', this.#scope) && isIn(this.#property, this.#scope.data)) {
			return this.#scope.data[this.#property]
		}

		if(isIn(this.#property, this.#scope)) {
			return this.#scope[this.#property]
		}

		logger().info(`Unable to find property '${ this.#property }`, this.#scope)

		return undefined
	}

	/**
	 * Set the value of the property that is being watched by this context on its
	 * underlying scope object. The context sets the value on a data object if one
	 * exists on the scope or directly on the scope itself.
	 * @param {*} value
	 */
	set value(value) {
		if(isIn('data', this.#scope) && isIn(this.#property, this.#scope.data)) {
			this.#scope.data[this.#property] = value
			return
		}

		if(isIn(this.#property, this.#scope)) {
			this.#scope[this.#property] = value
			return
		}

		logger().error(`Unable to set property '${ this.#property }'' to value '${ value }'`, this.#scope)
	}

	/**
	 * Update the HTML Node using the callback function provided in the constructor.
	 * @return {boolean}
	 */
	render() {
		return this.#callback(this)
	}
}
