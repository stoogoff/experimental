
import { logger } from '../config.js'
import { directives } from '../directives.js'
import { createId } from '../../utils/string.js'

const createNode = (context, base, value, index, ref) => {
	logger().log(`each (directive): ${ ref } building index[${ index }]`, value, context)

	const clone = base.cloneNode(true)

	clone.setAttribute('data-current', JSON.stringify(value))
	clone.setAttribute('data-ref', ref)
	clone.setAttribute('data-index', index)

	// create scope from value or by cloning from the component
	const newScope = 'clone' in context.scope ? context.scope.clone(value) : value

	logger().log(`each (directive): ${ ref } creating new scope`, newScope)

	directives.loadDirectivesForNode(clone, newScope)

	return clone
}

export const each = (context) => {
	const ref = `each-${ createId(10) }`
	const initialValues = context.value ?? []
	const parent = context.node.parentNode
	const base = context.node.cloneNode(true)

	logger().log(`each (directive): ${ ref } building`, context, parent, initialValues)

	const nodeList = []

	// clone nodes
	initialValues.forEach((value, index) => {
		nodeList.push(createNode(context, base, value, index, ref))
	})

	context.node.replaceWith(...nodeList)

	context.scope.on(`change:${context.property}`, (key, values, old) => {
		logger().log(`each (directive): ${ ref } rebuilding`, context, parent, values)

		// get a list of nodes which belong to this each
		const affectedNodes = Array.from(parent.querySelectorAll(`*[data-ref=${ref}]`))
		let lastNode = null

		values.forEach((value, index) => {
			// ignore a node if it already exists
			if(affectedNodes[index]) {
				const currentValue = JSON.stringify(value)
				const cachedValue = affectedNodes[index].getAttribute('data-current')

				if(cachedValue === currentValue) {
					logger().log(`each (directive): ${ ref } rebuilding ${ index } — matched value skipping`)
					lastNode = affectedNodes[index]
				}
				else {
					logger().log(`each (directive): ${ ref } rebuilding ${ index } — different value replacing`)
					const clone = createNode(context, base, value, index, ref)

					affectedNodes[index].replaceWith(clone)
					lastNode = clone
				}
			}
			else {
				logger().log(`each (directive): ${ ref } rebuilding ${ index } — new value creating`)
				const clone = createNode(context, base, value, index, ref)

				// insert the clone after the last affected node
				lastNode.insertAdjacentElement('afterend', clone)
				lastNode = clone
			}
		})
	})

	return true
}
