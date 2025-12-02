
import { describe, assert, MockNode } from '../../../src/test/index.js'
import { ProxiedModel } from '../../../src/data/model.js'
import { Context } from '../../../src/reactive/context.js'
import { eventHandlerDirective } from '../../../src/reactive/directives/event.js'

describe('reactive/directives/event', test => {
	const PROPERTY = 'handler'
	const event = eventHandlerDirective(PROPERTY)

	let mockNode, mockScope, callableContext, nonCallableContext, callValue = null

	test.before(() => {
		callValue = null
		mockNode = new MockNode()
		mockScope = new ProxiedModel({
			callable: (evt, context) => {
				callValue = { evt, context }
			},
			noncallable: 'Hello World'
		})
		callableContext = new Context(mockNode, 'callable', mockScope, event)
		nonCallableContext = new Context(mockNode, 'noncallable', mockScope, event)
	})

	test('function is called', () => {
		callableContext.render()

		mockNode.callEvent(PROPERTY)

		assert(callValue).notNull()
		assert(callValue.evt).notNull()
		assert(callValue.context).notNull
		assert(callValue.context).isEqual(callableContext)
	})

	test('non-function properties are ignored', () => {
		assert(callValue).isNull()
	})
})
