
import { Component } from './component.js'
import * as core from './directives/index.js'

const _directives = []
const _components = {}

export const directives = {
	register(attribute, callback) {
		_directives.push({ attribute, callback })
	},

	registerComponent(name, component) {
		if(name in _components) throw new Error(`Component with name '${name}' already exists`)

		_components[name] = component
	},

	load(domNodeOrId, input = {}) {
		const root = domNodeOrId instanceof Node
			? domNodeOrId
			: document.getElementById(domNodeOrId)

		const scope = new Component(input)

		this.walkTree(root, scope)
	},

	walkTree(root, scope) {
		const childNodes = Array.from(root.childNodes)

		childNodes.forEach(node => {
			if(node.nodeType !== 1) return

			_directives.forEach(({ attribute, callback }) => {
				if(!(attribute in node.dataset)) return

				callback(node, node.dataset[attribute], scope, this)

				node.removeAttribute(`data-${ attribute }`)
			})

			if(node.hasChildNodes()) {
				this.walkTree(node, scope)
			}
		})
	},
}

// register core directives
Object.keys(core).forEach(key => {
	directives.register(key.replace(/^_/, ''), core[key])
})

directives.register('component', (node, property, scope, d) => {
	const newScope = new Component(_components[property], scope.data)

	if(!(property in _components)) throw new Error(`Component '${ property }' not found.`)

	d.walkTree(node, newScope)

	newScope.mounted()
})
