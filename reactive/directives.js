
import { Component } from './component.js'
import { click, disabled, each, input, value, _if } from './directives/index.js'

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

	load(domNodeOrId) {
		const root = domNodeOrId instanceof Node
			? domNodeOrId
			: document.getElementById(domNodeOrId)

		for(let name in _components) {
			const componentNodes = root.querySelectorAll(`[data-component=${name}]`)

			Array.from(componentNodes).forEach(node => {
				const attributes = node.dataset['attributes'] || '{}'
				const scope = new Component(_components[name], JSON.parse(attributes))

				this.loadDirectivesForNode(node, scope)

				scope.mounted()
			})
		}
	},

	loadDirectivesForNode(node, scope) {
		_directives.forEach(({ attribute, callback }) => {
			const nodes = node.querySelectorAll(`[data-${attribute}]`)

			Array.from(nodes).forEach(node => callback(node, node.dataset[attribute], scope, this))
		})
	},
}

// register core directives
directives.register('click', click)
directives.register('disabled', disabled)
directives.register('if', _if)
directives.register('input', input)
directives.register('value', value)
directives.register('each', each)
