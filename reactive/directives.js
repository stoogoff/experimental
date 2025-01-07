
import { Component } from './component.js'
import * as core from './directives/index.js'

const _directives = []
const _components = {}

let num = 0

export const directives = {
	register(attribute, callback) {
		_directives.push({ attribute, callback })
	},

	registerComponent(name, component) {
		if(name in _components) throw new Error(`Component with name '${ name }' already exists`)

		_components[name] = component
	},

	getComponent(name) {
		if(!(name in _components)) throw new Error(`Component '${ name }' not found.`)

		return _components[name]
	},

	load(domNodeOrId, input = {}) {
		const root = domNodeOrId instanceof Node
			? domNodeOrId
			: document.getElementById(domNodeOrId)

		const scope = new Component(root, input)

		this.loadDirectivesForNode(root, scope)
	},

	loadDirectivesForNode(root, scope) {
		const childNodes = Array.from(root.childNodes)
		let complete = false

		childNodes.forEach(node => {
			if(node.nodeType !== 1) return

			_directives.forEach(({ attribute, callback }) => {
				if(!(attribute in node.dataset)) return

				const result = callback(node, node.dataset[attribute], scope, this)

				node.removeAttribute(`data-${ attribute }`)

				if(!complete) complete = result
			})

			if(!complete && node.hasChildNodes()) {
				this.loadDirectivesForNode(node, scope)
			}
		})
	},
}

// register core directives
Object.keys(core).forEach(key => {
	directives.register(key.replace(/^_/, ''), core[key])
})
