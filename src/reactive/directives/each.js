
import { createId } from '../../utils/string.js'
import { notNull } from '../../utils/assert.js'
import { logger } from '../config.js'
import { directives } from '../directives.js'

const createNode = (context, base, value, ref) => {
	logger().log(`each (directive): ${ ref } building`, value, context)

	const clone = base.cloneNode(true)

	clone.setAttribute('data-current', JSON.stringify(value))
	clone.setAttribute('data-ref', ref)

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
	const insertionPoint = context.node.previousElementSibling

	logger().log(`each (directive): ${ ref } building`, context, parent, initialValues)

	// clone nodes
	const nodeList = initialValues.map(value => createNode(context, base, value, ref))

	context.node.replaceWith(...nodeList)

	context.scope.on(`change:${context.property}`, (key, values, old) => {
		logger().log(`each (directive): ${ ref } rebuilding`, context, parent, values)

		// get a list of nodes which belong to this each
		const affectedNodes = Array.from(parent.querySelectorAll(`*[data-ref=${ref}]`))
		let lastNode = insertionPoint

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
					const clone = createNode(context, base, value, ref)

					affectedNodes[index].replaceWith(clone)
					lastNode = clone
				}
			}
			else {
				logger().log(`each (directive): ${ ref } rebuilding ${ index } — new value creating`)

				const clone = createNode(context, base, value, ref)

				if(notNull(lastNode)) {
					// insert the clone after the last affected node if it exists
					lastNode.insertAdjacentElement('afterend', clone)
				}
				else {
					// otherwise append to the parent
					parent.appendChild(clone)
				}

				lastNode = clone
			}
		})

		// remove any additional nodes
		if(values.length < affectedNodes.length) {
			logger().log(`each (directive): ${ ref } rebuilding — removing ${ affectedNodes.length - values.length } node(s)`)

			for(let i = affectedNodes.length - 1, len = values.length; i >= len; --i) {
				affectedNodes[i].remove()
			}
		}
	})

	return true
}
