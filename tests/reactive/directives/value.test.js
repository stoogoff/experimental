import { describe, assert } from '../../tests.js'
import { ProxiedModel } from '../../../src/data/model.js'
import { directives } from '../../../src/reactive/directives.js'
import { Context } from '../../../src/reactive/context.js'
import { value } from '../../../src/reactive/directives/value.js'

describe('reactive/directives/value', test => {
	class MockNode {
		constructor() {
			this.innerText = ''
		}
	}

//node
//property
//scope
//callback

	const mockNode = {
		innerText: ''
	}

	test('sets the initial value', () => {
		const mockNode = new MockNode()
		const mockScope = new ProxiedModel({
			property: 'Hello World'
		})
		const context = new Context(mockNode, 'property', mockScope, value)

		context.render()

		assert(mockNode.innerText).isEqual(context.value)
		assert(mockNode.innerText).isEqual('Hello World')
	})

	test('updates when the context value changes', () => {
		const mockNode = new MockNode()
		const mockScope = new ProxiedModel({
			property: 'Hello World'
		})
		const context = new Context(mockNode, 'property', mockScope, value)

		context.render()

		assert(mockNode.innerText).isEqual(context.value)
		assert(mockNode.innerText).isEqual('Hello World')

		context.value = 'Hello Mars'

		assert(mockNode.innerText).isEqual(context.value)
		assert(mockNode.innerText).isEqual('Hello Mars')
	})

	test('updates when the model value changes', () => {
		const mockNode = new MockNode()
		const mockScope = new ProxiedModel({
			property: 'Hello World'
		})
		const context = new Context(mockNode, 'property', mockScope, value)

		context.render()

		assert(mockNode.innerText).isEqual(context.value)
		assert(mockNode.innerText).isEqual('Hello World')

		mockScope.property = 'Hello Mars'

		assert(mockNode.innerText).isEqual(context.value)
		assert(mockNode.innerText).isEqual('Hello Mars')
	})

	test("doesn't update when a different model property changes", () => {
		const mockNode = new MockNode()
		const mockScope = new ProxiedModel({
			property1: 'Hello World',
			property2: 'Hello Venus',
		})
		const context = new Context(mockNode, 'property1', mockScope, value)

		context.render()

		assert(mockNode.innerText).isEqual(context.value)
		assert(mockNode.innerText).isEqual('Hello World')

		mockScope.property2 = 'Hello Mars'

		assert(mockNode.innerText).isEqual(context.value)
		assert(mockNode.innerText).isEqual('Hello World')
	})
})
