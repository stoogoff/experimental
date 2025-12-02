
import { describe, assert, MockNode } from '../../../src/test/index.js'
import { ProxiedModel } from '../../../src/data/model.js'
import { Context } from '../../../src/reactive/context.js'
import { _if, disabled, booleanDirective } from '../../../src/reactive/directives/boolean.js'

describe('reactive/directives/boolean', test => {
	const TYPE = 'type'
	const directive = booleanDirective(TYPE, (node, bool) => {
		callValue = { node, bool }
	})

	let mockNode, mockScope, context, callValue = null

	test.before(() => {
		callValue = null
		mockNode = new MockNode()
		mockScope = new ProxiedModel({
			property: true
		})
		context = new Context(mockNode, 'property', mockScope, directive)
	})

	test('sets the initial value', () => {
		context.render()

		assert(callValue).notNull()
		assert(callValue.node).notNull()
		assert(callValue.node).isEqual(mockNode)
		assert(callValue.bool).isTrue()
	})

	test('updates when the context value changes', () => {
		context.render()

		assert(callValue).notNull()
		assert(callValue.node).notNull()
		assert(callValue.node).isEqual(mockNode)
		assert(callValue.bool).isTrue()

		context.value = false

		assert(callValue).notNull()
		assert(callValue.node).notNull()
		assert(callValue.node).isEqual(mockNode)
		assert(callValue.bool).isFalse()
	})

	test('updates when the model value changes', () => {
		context.render()

		assert(callValue).notNull()
		assert(callValue.node).notNull()
		assert(callValue.node).isEqual(mockNode)
		assert(callValue.bool).isTrue()

		mockScope.property = false

		assert(callValue).notNull()
		assert(callValue.node).notNull()
		assert(callValue.node).isEqual(mockNode)
		assert(callValue.bool).isFalse()
	})
})

describe('reactive/directives/boolean: !inverted', test => {
	const TYPE = 'type'
	const directive = booleanDirective(TYPE, (node, bool) => {
		callValue = { node, bool }
	})

	let mockNode, mockScope, context, callValue = null

	test.before(() => {
		callValue = null
		mockNode = new MockNode()
		mockScope = new ProxiedModel({
			property: true
		})
		context = new Context(mockNode, '!property', mockScope, directive)
	})

	test('sets the initial value', () => {
		context.render()

		assert(callValue).notNull()
		assert(callValue.node).notNull()
		assert(callValue.node).isEqual(mockNode)
		assert(callValue.bool).isFalse()
	})

	test('updates when the context value changes', () => {
		context.render()

		assert(callValue).notNull()
		assert(callValue.node).notNull()
		assert(callValue.node).isEqual(mockNode)
		assert(callValue.bool).isFalse()

		context.value = false

		assert(callValue).notNull()
		assert(callValue.node).notNull()
		assert(callValue.node).isEqual(mockNode)
		assert(callValue.bool).isTrue()
	})

	test('updates when the model value changes', () => {
		context.render()

		assert(callValue).notNull()
		assert(callValue.node).notNull()
		assert(callValue.node).isEqual(mockNode)
		assert(callValue.bool).isFalse()

		mockScope.property = false

		assert(callValue).notNull()
		assert(callValue.node).notNull()
		assert(callValue.node).isEqual(mockNode)
		assert(callValue.bool).isTrue()
	})
})


describe('reactive/directives/boolean: disabled', test => {
	const PROPERTY = 'disabled'
	const directive = booleanDirective(PROPERTY)

	let mockNode, mockScope, context

	test.before(() => {
		mockNode = new MockNode()
		mockScope = new ProxiedModel({
			property: true
		})
		context = new Context(mockNode, 'property', mockScope, disabled)
	})

	test('sets the initial attribute value', () => {
		context.render()

		assert(mockNode.hasAttribute(PROPERTY)).isTrue()
		assert(mockNode.getAttribute(PROPERTY)).isEqual(PROPERTY)
	})

	test('updates when the context value changes', () => {
		context.render()

		assert(mockNode.hasAttribute(PROPERTY)).isTrue()
		assert(mockNode.getAttribute(PROPERTY)).isEqual(PROPERTY)

		context.value = false

		assert(mockNode.hasAttribute(PROPERTY)).isFalse()
	})

	test('updates when the model value changes', () => {
		context.render()

		assert(mockNode.hasAttribute(PROPERTY)).isTrue()
		assert(mockNode.getAttribute(PROPERTY)).isEqual(PROPERTY)

		mockScope.property = false

		assert(mockNode.hasAttribute(PROPERTY)).isFalse()
	})

	test("doesn't update when a different model property changes", () => {
		const mockNode = new MockNode()
		const mockScope = new ProxiedModel({
			property1: true,
			property2: false,
		})
		const context = new Context(mockNode, 'property1', mockScope, disabled)

		context.render()

		assert(mockNode.hasAttribute(PROPERTY)).isTrue()
		assert(mockNode.getAttribute(PROPERTY)).isEqual(PROPERTY)

		mockScope.property2 = true

		assert(mockNode.hasAttribute(PROPERTY)).isTrue()
		assert(mockNode.getAttribute(PROPERTY)).isEqual(PROPERTY)
	})
})
