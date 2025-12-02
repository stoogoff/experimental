import { describe, assert, MockNode } from '../../tests.js'
import { ProxiedModel } from '../../../src/data/model.js'
import { Context } from '../../../src/reactive/context.js'
import { attributeDirective } from '../../../src/reactive/directives/attribute.js'

describe('reactive/directives/attribute', test => {
	const PROPERTY = 'attribute'
	const directive = attributeDirective(PROPERTY)

	let mockNode, mockScope, context

	test.before(() => {
		mockNode = new MockNode()
		mockScope = new ProxiedModel({
			property: 'Hello World'
		})
		context = new Context(mockNode, 'property', mockScope, directive)
	})

	test('sets the initial attribute value', () => {
		context.render()

		assert(mockNode.getAttribute(PROPERTY)).isEqual(context.value)
		assert(mockNode.getAttribute(PROPERTY)).isEqual('Hello World')
	})

	test('updates when the context value changes', () => {
		context.render()

		assert(mockNode.getAttribute(PROPERTY)).isEqual(context.value)
		assert(mockNode.getAttribute(PROPERTY)).isEqual('Hello World')

		context.value = 'Hello Mars'

		assert(mockNode.getAttribute(PROPERTY)).isEqual(context.value)
		assert(mockNode.getAttribute(PROPERTY)).isEqual('Hello Mars')
	})

	test('updates when the model value changes', () => {
		context.render()

		assert(mockNode.getAttribute(PROPERTY)).isEqual(context.value)
		assert(mockNode.getAttribute(PROPERTY)).isEqual('Hello World')

		mockScope.property = 'Hello Mars'

		assert(mockNode.getAttribute(PROPERTY)).isEqual(context.value)
		assert(mockNode.getAttribute(PROPERTY)).isEqual('Hello Mars')
	})

	test("doesn't update when a different model property changes", () => {
		const mockNode = new MockNode()
		const mockScope = new ProxiedModel({
			property1: 'Hello World',
			property2: 'Hello Venus',
		})
		const context = new Context(mockNode, 'property1', mockScope, directive)

		context.render()

		assert(mockNode.getAttribute(PROPERTY)).isEqual(context.value)
		assert(mockNode.getAttribute(PROPERTY)).isEqual('Hello World')

		mockScope.property2 = 'Hello Mars'

		assert(mockNode.getAttribute(PROPERTY)).isEqual(context.value)
		assert(mockNode.getAttribute(PROPERTY)).isEqual('Hello World')
	})
})
