
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
	const initialValues = scope.data[property] ?? []
	let cachedValue = JSON.stringify(initialValues)

	logger().info(`each (directive): '${ property }'`, scope, node, parent)

	// clone the base node to maintain data-* attributes
	const clone = node.cloneNode(true)

	// remove base node
	node.remove()

	// clone nodes
	initialValues.forEach(value => {
		createNode(clone, parent, value, scope, directives)
	})

	scope.on(`change:${property}`, (key, values, old) => {
		const matchValue = JSON.stringify(values)

		logger().info('each (directive):', { cachedValue, matchValue, match: cachedValue === matchValue })

		if(cachedValue === matchValue) return

		// remove existing nodes
		while(parent.firstChild) {
			parent.removeChild(parent.lastChild)
		}

		// clone nodes
		values.forEach(value => {
			createNode(clone, parent, value, scope, directives)
		})

		cachedValue = matchValue
	})

	return true
}
