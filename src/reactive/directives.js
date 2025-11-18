
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
	setPrefix(prefix) {
		logger().log(`Setting prefix: ${ prefix }`)

		_prefix = prefix
	},

	// register directives
	register(attribute, callback) {
		_directives.push({ attribute, callback })
	},

	// register and retrieve components
	registerComponents(kvp) {
		Object.keys(kvp).forEach(key => this.registerComponent(key, kvp[key]))
	},

	registerComponent(name, component) {
		logger().log(`Registering component: ${ name }`)

		if(name in _components) logger().error(`Component with name '${ name }' already exists`)

		_components[name] = component
	},

	getComponent(name) {
		if(!(name in _components)) logger().error(`Component '${ name }' not found.`)

		return _components[name]
	},

	// register and retrieve stores
	registerStore(name, store) {
		logger().log(`Registering store: ${ name }`)

		if(name in _stores) logger().error(`Store with name '${ name }' already exists`)

		_stores[name] = store
	},

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
