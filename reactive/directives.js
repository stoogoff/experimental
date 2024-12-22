
import { Component } from './component.js'

export const directives = (function() {
	const directives = []
	const components = {}

	return {
		register(attribute, callback) {
			directives.push({ attribute, callback })
		},

		registerComponent(name, component) {
			if(name in components) throw new Error(`Component with name '${name}' already exists`)

			components[name] = component
		},

		load(domNodeOrId) {
			const root = domNodeOrId instanceof Node
				? domNodeOrId
				: document.getElementById(domNodeOrId)

			for(let name in components) {
				const componentNodes = root.querySelectorAll(`[data-component=${name}]`)

				Array.from(componentNodes).forEach(node => {
					const attributes = node.dataset['attributes'] || '{}'
					const scope = new Component(components[name], JSON.parse(attributes))

					this.loadDirectivesForNode(node, scope)

					scope.mounted()
				})
			}
		},

		loadDirectivesForNode(node, scope) {
			directives.forEach(({ attribute, callback }) => {
				const nodes = node.querySelectorAll(`[data-${attribute}]`)

				Array.from(nodes).forEach(node => callback(node, node.dataset[attribute], scope))
			})
		},
	}
})()

directives.register('value', (node, property, scope) => {
	node.innerText = scope.data[property]

	scope.on(`change:${property}`, (key, value, old) => {
		node.innerText = value
	})
})

directives.register('input', (node, property, scope) => {
	const value = scope.data[property]
	const checkbox = node.type === 'checkbox'

	if(checkbox) {
		node.checked = value
	}
	else {
		node.value = value
	}

	node.onchange = (evt) => {
		scope.data[property] = checkbox ? evt.target.checked : evt.target.value
	}

	scope.on(`change:${property}`, (key, value, old) => {
		node.value = value
	})
})

directives.register('click', (node, property, scope) => {
	node.onclick = (evt) => {
		scope[property](scope, evt)
	}
})

function booleanValue(type, updateNode) {
	directives.register(type, (node, property, scope) => {
		const invert = property.startsWith('!')

		property = property.replace(/^!/, '')

		const bool = scope.data[property]

		updateNode(node, invert ? !bool : bool)

		scope.on(`change:${property}`, (key, value, old) => {
			updateNode(node, invert ? !value : value)
		})
	})
}

booleanValue('disabled', (node, bool) => {
	if(bool) {
		node.setAttribute('disabled', 'disabled')
	}
	else {
		node.removeAttribute('disabled')	
	}
})
booleanValue('if', (node, bool) => {
	node.style.display = bool ? '' : 'none'
})


function each() {
	const createNode = (node, parent, value, scope) => {
		const clone = node.cloneNode(true)

		clone.removeAttribute('data-each')

		if(clone.childNodes.length === 0) {
			clone.innerText = value
		}
		else {
			const newScope = scope.clone(value)

			directives.loadDirectivesForNode(clone, newScope)
		}

		parent.appendChild(clone)
	}

	directives.register('each', (node, property, scope) => {
		const parent = node.parentNode
		const values = scope.data[property]

		if(!values) return

		// clone nodes
		values.forEach(value => {
			createNode(node, parent, value, scope)
		})

		// remove base node
		node.remove()

		scope.on(`change:${property}`, (key, values, old) => {
			// remove existing nodes
			// TODO remove only nodes we're aware of, not everything
			while(parent.firstChild) {
				parent.removeChild(parent.lastChild)
			}

			// clone nodes
			values.forEach(value => {
				createNode(node, parent, value, scope)
			})
		})
	})
}

each()
