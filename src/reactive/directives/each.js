
import { logger } from '../config.js'
import { directives } from "../directives.js"

const createNode = (context, parent, value) => {
	logger().info(`each (directive): clone node with value`, value)

	const clone = context.node.cloneNode(true)

	if(clone.hasChildNodes()) {
		const newScope = clone in context.scope ? context.scope.clone(value) : value

		logger().log(`each (directive): creating new scope`, newScope)

		directives.loadDirectivesForNode(clone, newScope)
	}
	else {
		clone.innerText = value
	}

	parent.appendChild(clone)
}

export const each = (context) => {
	const parent = context.node.parentNode
	const initialValues = context.value ?? []
	let cachedValue = JSON.stringify(initialValues)

	logger().info(`each (directive): '${ context.value }'`, context)

	// clone the base node to maintain data-* attributes
	const clone = context.node.cloneNode(true)

	// remove base node
	context.node.remove()

	// clone nodes
	initialValues.forEach(value => {
		createNode(context, parent, value)
	})

	context.scope.on(`change:${context.property}`, (key, values, old) => {
		const matchValue = JSON.stringify(values)

		logger().info('each (directive):', { cachedValue, matchValue, match: cachedValue === matchValue })

		if(cachedValue === matchValue) return

		// remove existing nodes
		while(parent.firstChild) {
			parent.removeChild(parent.lastChild)
		}

		// clone nodes
		values.forEach(value => {
			createNode(context, parent, value)
		})

		cachedValue = matchValue
	})

	return true
}
