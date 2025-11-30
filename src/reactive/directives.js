
import { Component } from './component.js'
import { logger } from './config.js'
import { Context } from './context.js'
import * as core from './directives/index.js'
import { notIn } from '../utils/assert.js'

const _directives = []
const _components = {}
const _stores = {}
let _prefix = 'q'

export const directives = {
	/**
	 * Set the prefix to use in all data attributes. The dedault is q.
	 * @example
	 * directives.setPrefix('hello')
	 * // <div data-hello-value="property"></div>
	 * @param {string} prefix - The prefix to use.
	 */
	setPrefix(prefix) {
		logger().log(`Setting prefix: ${ prefix }`)

		_prefix = prefix
	},

	/**
	 * Return the current prefix.
	 * @return {string} The prefix.
	 */
	getPrefix() {
		return _prefix
	},

	/**
	 * Register directives with the system.
	 * @example
	 * directives.register('hello', (ctx) => {})
	 * // <div data-q-hello="property"></div>
	 * @param {string} attribute - The HTML attribute name to use in HTML.
	 * @param {Function} callback - The callback function used to render the HTML.
	 */
	register(attribute, callback) {
		_directives.push({ attribute, callback })
	},

	// register and retrieve components

	/**
	 * Register a group of components with the system.
	 * @example
	 * const components = {
	 * 	'hello': {},
	 * 	'world': {},
	 * }
	 * directives.registerComponents(components)
	 * // <div data-q-component="hello"></div>
	 * @param {Object} kvp - The key value set of components.
	 */
	registerComponents(kvp) {
		Object.keys(kvp).forEach(key => this.registerComponent(key, kvp[key]))
	},

	/**
	 * Register a single component by name with the system. Ignores the new
	 * component if the name already exists.
	 * @example
	 * directives.registerComponent('hello', {})
	 * // <div data-q-component="hello"></div>
	 * @paran {string} name - The name of the component.
	 * @param {Object} component - The component definition.
	 */
	registerComponent(name, component) {
		logger().log(`Registering component: ${ name }`)

		if(name in _components) {
			logger().error(`Component with name '${ name }' already exists`)
			return
		}

		_components[name] = component
	},

	/**
	 * Return a registered component by its name.
	 * @param {string} name - The name of the component.
	 * @return {Object} The component.
	 */
	getComponent(name) {
		if(!(name in _components)) logger().error(`Component '${ name }' not found.`)

		return _components[name] ?? {}
	},

	// register and retrieve stores

	/**
	 * Register a store by its name. Ignores the new store if the name
	 * already exists.
	 * @example
	 * directives.registerStore('store', new ListStore())
	 * // <div data-q-store="store"></div>
	 * @param {string} name - The name of the store.
	 * @param {ListStore | SetStore} store - The store to register.
	 */
	registerStore(name, store) {
		logger().log(`Registering store: ${ name }`)

		if(name in _stores) {
			logger().error(`Store with name '${ name }' already exists`)
			return
		}

		_stores[name] = store
	},

	/**
	 * Return a store by its name.
	 * @param {string} name - The name of the store.
	 * @return {ListStore | SetStore}
	 */
	getStore(name) {
		if(!(name in _stores)) logger().error(`Store '${ name }' not found.`)

		return _stores[name]
	},

	load(domNodeOrId, input = {}) {
		const root = domNodeOrId instanceof Node
			? domNodeOrId
			: document.getElementById(domNodeOrId)

		const scope = new Component(root, input)

		logger().info('directives.load', root, input)

		this.loadDirectivesForNode(root, scope)

		logger().info('directives.load COMPLETE')
	},

	loadDirectivesForNode(root, scope) {
		logger().info('BEGIN directives.loadDirectivesForNode', root, scope)

		const children = Array.from(root.children)

		children.forEach(node => {
			let complete = false

			_directives.forEach(({ attribute, callback }) => {
				const prefixedAttribute = `data-${ _prefix }-${ attribute}`

				if(!node.hasAttribute(prefixedAttribute)) return

				logger().info(`directives: apply attribute '${ attribute }'`, node, scope)

				const context = new Context(
					node,
					node.getAttribute(prefixedAttribute),
					scope,
					callback,
					this
				)
				const result = context.render()

				node.removeAttribute(prefixedAttribute)

				if(!complete) complete = result
			})

			if(!complete && node.hasChildNodes()) {
				logger().info('RECURSE directives.loadDirectivesForNode', node)
				this.loadDirectivesForNode(node, scope)
			}
		})

		logger().info('END directives.loadDirectivesForNode', root)
	},
}

// register core directives
Object.keys(core).forEach(key => {
	directives.register(key.replace(/^_/, ''), core[key])
})
