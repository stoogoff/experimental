import { describe, assert } from '../../src/test/index.js'
import { directives } from '../../src/reactive/directives.js'

describe('reactive/directives: prefix', test => {
	test('returns a default prefix', () => {
		assert(directives.getPrefix()).isEqual('q')
	})

	test('sets the prefix', () => {
		directives.setPrefix('hello')

		assert(directives.getPrefix()).isEqual('hello')
	})
})

describe('reactive/directives: components', test => {
	test('returns an empty object if not found', () => {
		const returnedComponent = directives.getComponent('test1')

		assert(returnedComponent).notNull()
		assert(returnedComponent.data).isNull()
	})

	test('sets a component by name', () => {
		const mockComponent = { data: { property: 'Hello World' }}
		directives.registerComponent('test2', mockComponent)

		const returnedComponent = directives.getComponent('test2')

		assert(returnedComponent).notNull()
		assert(returnedComponent).isEqual(mockComponent)
	})

	test('sets multiple components at once', () => {
		const mockComponent1 = { data: { property: 'Hello Earth' }}
		const mockComponent2 = { data: { property: 'Hello Venus' }}

		directives.registerComponents({
			'comp1': mockComponent1,
			'comp2': mockComponent2,
		})

		const returnedComponent1 = directives.getComponent('comp1')

		assert(returnedComponent1).notNull()
		assert(returnedComponent1).isEqual(mockComponent1)
		assert(returnedComponent1.data.property).isEqual('Hello Earth')

		const returnedComponent2 = directives.getComponent('comp2')

		assert(returnedComponent2).notNull()
		assert(returnedComponent2).isEqual(mockComponent2)
		assert(returnedComponent2.data.property).isEqual('Hello Venus')
	})
})
