import { describe, assert } from '../../src/test/index.js'
import { Context } from '../../src/reactive/context.js'

describe('reactive/context: constructor', test => {
	test('should throw if node is not provided', () => {
		assert(() => new Context()).throwsError()
	})

	test('should throw if property is not provided', () => {
		assert(() => new Context({})).throwsError()
	})

	test('should throw if scope is not provided', () => {
		assert(() => new Context({}, 'property')).throwsError()
	})

	test('should throw if callback is not provided', () => {
		assert(() => new Context({}, 'property', {})).throwsError()
	})

	test('should throw if callback is not a function', () => {
		assert(() => new Context({}, 'property', {}, 6)).throwsError()
	})
})

describe('reactive/context: get value', test => {
	test("returns undefined if the property isn't found", () => {
		const context = new Context({}, 'property', {}, () => {})

		assert(context.value).isNull()
	})

	test('returns the property value from the scope', () => {
		const mockScope = { property: 'Hello World' }
		const context = new Context({}, 'property', mockScope, () => {})

		assert(context.value).isEqual('Hello World')
	})

	test("returns the property value from the scope's data", () => {
		const mockScope = { data: { property: 'Hello World' }}
		const context = new Context({}, 'property', mockScope, () => {})

		assert(context.value).isEqual('Hello World')
	})
})

describe('reactive/context: set value', test => {
	test("doesn't set a property on the scope if it doesn't exist", () => {
		const mockScope = {}
		const context = new Context({}, 'property', mockScope, () => {})

		context.value = 'Hello World'

		assert(context.value).isNull()
		assert(mockScope.property).isNull()
	})

	test('sets the property value on the scope', () => {
		const mockScope = { property: 'Hello World' }
		const context = new Context({}, 'property', mockScope, () => {})

		context.value = 'Hello Earth'

		assert(context.value).isEqual('Hello Earth')
		assert(mockScope.property).isEqual('Hello Earth')
	})

	test("sets the property value on the scope's data", () => {
		const mockScope = { data: { property: 'Hello World' }}
		const context = new Context({}, 'property', mockScope, () => {})

		context.value = 'Hello Earth'

		assert(context.value).isEqual('Hello Earth')
		assert(mockScope.data.property).isEqual('Hello Earth')
	})
})

describe('reactive/context: render', test => {
	test('render calls the callback function with the context as the argument', () => {
		let called = false
		const callback = () => {
			called = true
		}

		const context = new Context({}, 'property', {}, callback)

		context.render()

		assert(called).isTrue()
	})
})
