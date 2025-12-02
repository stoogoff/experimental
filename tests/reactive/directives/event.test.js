
import { describe, assert, MockNode } from '../../../src/test/index.js'
import { ProxiedModel } from '../../../src/data/model.js'
import { Context } from '../../../src/reactive/context.js'
import { eventHandlerDirective } from '../../../src/reactive/directives/event.js'

describe('reactive/directives/event', test => {
	const PROPERTY = 'handler'
	const event = eventHandlerDirective(PROPERTY)

	let mockNode, mockScope, callValue = null

	test.before(() => {
		callValue = null
		mockNode = new MockNode()
		mockScope = new ProxiedModel({
			callable: (evt, context) => {
				callValue = { evt, context }
			},
			noncallable: 'Hello World'
		})
	})

	test('function is called', () => {
		const context = new Context(mockNode, 'callable', mockScope, event)

		context.render()
		mockNode.callEvent(PROPERTY)

		assert(callValue).notNull()
		assert(callValue.evt).notNull()
		assert(callValue.context).notNull
		assert(callValue.context).isEqual(context)
	})

	test('non-function properties are ignored', () => {
		const context = new Context(mockNode, 'noncallable', mockScope, event)

		context.render()
		mockNode.callEvent(PROPERTY)

		assert(callValue).isNull()
	})
})
