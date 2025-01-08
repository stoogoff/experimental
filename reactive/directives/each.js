
import { logger } from '../config.js'

const createNode = (node, parent, value, scope, directives) => {
	logger().info(`each (directive): clone node with value`, value)

	const clone = node.cloneNode(true)

	if(clone.hasChildNodes()) {
		const newScope = scope.clone(value)

		logger().log(`each (directive): creating new scope`, newScope)

		directives.loadDirectivesForNode(clone, newScope)
	}
	else {
		clone.innerText = value
	}

	parent.appendChild(clone)
}

export const each = (node, property, scope, directives) => {
	const parent = node.parentNode
	const values = scope.data[property] ?? []

	logger().info(`each (directive): '${ property }'`, scope, node, parent)

	// clone the base node to maintain data-* attributes
	const clone = node.cloneNode(true)

	// remove base node
	node.remove()

	// clone nodes
	values.forEach(value => {
		createNode(clone, parent, value, scope, directives)
	})

	scope.on(`change:${property}`, (key, values, old) => {
		// remove existing nodes
		// TODO this should only remove nodes that are part of the each
		// and not all child nodes of the parent
		while(parent.firstChild) {
			parent.removeChild(parent.lastChild)
		}

		// clone nodes
		values.forEach(value => {
			createNode(clone, parent, value, scope, directives)
		})
	})

	return true
}
