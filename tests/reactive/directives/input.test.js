
import { describe, assert, MockNode } from '../../../src/test/index.js'
import { ProxiedModel } from '../../../src/data/model.js'
import { Context } from '../../../src/reactive/context.js'
import { input } from '../../../src/reactive/directives/input.js'

describe('reactive/directives/input: text', test => {
	let mockNode, mockScope, context

	test.before(() => {
		mockNode = new MockNode()
		mockNode.type = 'text'
		mockScope = new ProxiedModel({
			property: 'Hello World'
		})
		context = new Context(mockNode, 'property', mockScope, input)
	})

	test('sets the initial value', () => {
		context.render()

		assert(mockNode.value).isEqual(context.value)
		assert(mockNode.value).isEqual('Hello World')
	})

	test('updates when the context value changes', () => {
		context.render()

		assert(mockNode.value).isEqual(context.value)
		assert(mockNode.value).isEqual('Hello World')

		context.value = 'Hello Mars'

		assert(mockNode.value).isEqual(context.value)
		assert(mockNode.value).isEqual('Hello Mars')
	})

	test('updates when the model value changes', () => {
		context.render()

		assert(mockNode.value).isEqual(context.value)
		assert(mockNode.value).isEqual('Hello World')

		mockScope.property = 'Hello Mars'

		assert(mockNode.value).isEqual(context.value)
		assert(mockNode.value).isEqual('Hello Mars')
	})

	test('updates the model and context when the input value changes', () => {
		context.render()

		assert(mockNode.value).isEqual(context.value)
		assert(mockNode.value).isEqual('Hello World')

		mockNode.value = 'Hello Mars'

		assert(context.value).isEqual(mockNode.value)
		assert(context.value).isEqual('Hello Mars')

		assert(mockScope.property).isEqual(mockNode.value)
		assert(mockScope.property).isEqual('Hello Mars')
	})
})

describe('reactive/directives/input: checkbox', test => {
	let mockNode, mockScope, context

	test.before(() => {
		mockNode = new MockNode()
		mockNode.type = 'checkbox'
		mockScope = new ProxiedModel({
			property: false
		})
		context = new Context(mockNode, 'property', mockScope, input)
	})

	test('sets the initial value', () => {
		context.render()

		assert(mockNode.checked).isEqual(context.value)
		assert(mockNode.checked).isFalse()
	})

	test('updates when the context value changes', () => {
		context.render()

		assert(mockNode.checked).isEqual(context.value)
		assert(mockNode.checked).isFalse()

		context.value = true

		assert(mockNode.checked).isEqual(context.value)
		assert(mockNode.checked).isEqual(mockScope.property)
		assert(mockNode.checked).isTrue()
	})

	test('updates when the model value changes', () => {
		context.render()

		assert(mockNode.checked).isEqual(context.value)
		assert(mockNode.checked).isFalse()

		mockScope.property = true

		assert(mockNode.checked).isEqual(context.value)
		assert(mockNode.checked).isEqual(mockScope.property)
		assert(mockNode.checked).isTrue()
	})

	test('updates the model and context when the input value changes', () => {
		context.render()

		assert(mockNode.checked).isEqual(context.value)
		assert(mockNode.checked).isFalse()

		mockNode.checked = true

		assert(context.value).isEqual(mockNode.checked)
		assert(context.value).isTrue()

		assert(mockScope.property).isEqual(mockNode.checked)
		assert(mockScope.property).isTrue()
	})
})
