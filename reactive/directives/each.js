
import { isEmptyArray } from '../../utils/assert.js'

const createNode = (node, parent, value, scope, directives) => {
	const clone = node.cloneNode(true)

	if(clone.hasChildNodes()) {
		const newScope = scope.clone(value)

		directives.loadDirectivesForNode(clone, newScope)
	}
	else {
		clone.innerText = value
	}

	parent.appendChild(clone)
}

export const each = (node, property, scope, directives) => {
	const parent = node.parentNode
	const values = scope.data[property]

	if(isEmptyArray(values)) return

	// clone nodes
	values.forEach(value => {
		createNode(node, parent, value, scope, directives)
	})

	// clone the base node to maintain data-* attributes
	const clone = node.cloneNode(true)

	// remove base node
	node.remove()

	scope.on(`change:${property}`, (key, values, old) => {
		// remove existing nodes
		while(parent.firstChild) {
			parent.removeChild(parent.lastChild)
		}

		// clone nodes
		values.forEach(value => {
			createNode(clone, parent, value, scope, directives)
		})
	})
}
