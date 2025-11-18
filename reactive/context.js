
import { logger } from './config.js'
import { isIn } from '../utils/assert.js'

export class Context {
	#node
	#attribute
	#scope
	#callback

	constructor(node, attribute, scope, callback) {
		this.#node = node
		this.#attribute = attribute
		this.#scope = scope
		this.#callback = callback
	}

	get node() {
		return this.#node
	}

	get scope() {
		return this.#scope
	}

	// the attribute value as a string
	get property() {
		return this.#attribute
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

	// the attribute value from the scope
	get value() {
		if(isIn('data', this.#scope) && isIn(this.#attribute, this.#scope.data)) {
			return this.#scope.data[this.#attribute]
		}

		if(isIn(this.#attribute, this.#scope)) {
			return this.#scope[this.#attribute]
		}

		logger().info(`Unable to find property '${ this.#attribute }`, this.#scope)

		return undefined
	}

	set value(value) {
		if(isIn('data', this.#scope) && isIn(this.#attribute, this.#scope.data)) {
			this.#scope.data[this.#attribute] = value
			return
		}

		if(isIn(this.#attribute, this.#scope.data)) {
			this.#scope[this.#attribute] = value
			return
		}

		logger().error(`Unable to set property '${ this.#attribute }'' to value '${ value }'`, this.#scope)
	}

	render() {
		return this.#callback(this)
	}
}
