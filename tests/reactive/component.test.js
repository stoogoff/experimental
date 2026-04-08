import { describe, assert } from '../../src/test/index.js'
import { Component } from '../../src/reactive/component.js'

const mockNode = () => ({ nodeType: 1 })

describe('reactive/component: constructor', test => {
	test('creates a component with default properties', () => {
		const node = mockNode()
		const component = new Component(node)
		assert(component.node).isEqual(node)
		assert(component.data).notNull()
	})

	test('sets data from the component definition', () => {
		const component = new Component(mockNode(), {
			data: { name: 'Hello', count: 0 },
		})
		assert(component.data.name).isEqual('Hello')
		assert(component.data.count).isEqual(0)
	})

	test('merges attributes into data', () => {
		const component = new Component(mockNode(), {
			data: { name: 'Hello' },
		}, { name: 'Overridden', extra: 'attribute' })
		assert(component.data.name).isEqual('Overridden')
		assert(component.data.extra).isEqual('attribute')
	})

	test('copies non-reserved properties to the instance', () => {
		const myMethod = () => 'hello'
		const component = new Component(mockNode(), {
			data: { name: 'Test' },
			myMethod,
			myProp: 42,
		})
		assert(component.myMethod).isEqual(myMethod)
		assert(component.myProp).isEqual(42)
	})

	test('does not copy data, watch, or computed to the instance', () => {
		const component = new Component(mockNode(), {
			data: { name: 'Test' },
			watch: {},
			computed: {},
		})
		assert(component.watch).isNull()
		assert(component.computed).isNull()
	})

	test('calls created during construction', () => {
		let createdCalled = false
		const component = new Component(mockNode(), {
			data: {},
			created() {
				createdCalled = true
			},
		})
		assert(createdCalled).isEqual(true)
	})
})

describe('reactive/component: data proxy', test => {
	test('emits change event when data is set', () => {
		const component = new Component(mockNode(), {
			data: { name: 'Hello' },
		})
		let emittedKey = null
		let emittedValue = null
		let emittedOld = null
		component.on('change', (key, value, old) => {
			emittedKey = key
			emittedValue = value
			emittedOld = old
		})
		component.data.name = 'World'
		assert(emittedKey).isEqual('name')
		assert(emittedValue).isEqual('World')
		assert(emittedOld).isEqual('Hello')
	})

	test('emits a namespaced change event', () => {
		const component = new Component(mockNode(), {
			data: { count: 0 },
		})
		let emittedValue = null
		component.on('change:count', (key, value, old) => {
			emittedValue = value
		})
		component.data.count = 5
		assert(emittedValue).isEqual(5)
	})

	test('does not emit change when value is the same', () => {
		const component = new Component(mockNode(), {
			data: { name: 'Hello' },
		})
		let changeCount = 0
		component.on('change', () => {
			changeCount++
		})
		component.data.name = 'Hello'
		assert(changeCount).isEqual(0)
	})
})

describe('reactive/component: watch', test => {
	test('calls watcher when watched property changes', () => {
		let watchedNew = null
		let watchedOld = null
		const component = new Component(mockNode(), {
			data: { name: 'Hello' },
			watch: {
				name(newVal, oldVal) {
					watchedNew = newVal
					watchedOld = oldVal
				},
			},
		})
		component.data.name = 'World'
		assert(watchedNew).isEqual('World')
		assert(watchedOld).isEqual('Hello')
	})

	test('does not call watcher for unrelated properties', () => {
		let called = false
		const component = new Component(mockNode(), {
			data: { name: 'Hello', count: 0 },
			watch: {
				name() {
					called = true
				},
			},
		})
		component.data.count = 5
		assert(called).isEqual(false)
	})

	test('watcher has access to component via this', () => {
		let watcherThis = null
		const component = new Component(mockNode(), {
			data: { name: 'Hello' },
			watch: {
				name() {
					watcherThis = this
				},
			},
		})
		component.data.name = 'World'
		assert(watcherThis).isEqual(component)
	})
})

describe('reactive/component: computed', test => {
	test('returns computed value from data proxy', () => {
		const component = new Component(mockNode(), {
			data: { first: 'Hello', last: 'World' },
			computed: {
				fullName() {
					return `${this.data.first} ${this.data.last}`
				},
			},
		})
		assert(component.data.fullName).isEqual('Hello World')
	})

	test('emits change event when computed value changes', () => {
		const component = new Component(mockNode(), {
			data: { count: 1 },
			computed: {
				doubled() {
					return this.data.count * 2
				},
			},
		})
		let emittedNew = null
		let emittedOld = null
		component.on('change:doubled', (key, newVal, oldVal) => {
			emittedNew = newVal
			emittedOld = oldVal
		})
		component.data.count = 5
		assert(emittedNew).isEqual(10)
		assert(emittedOld).isEqual(2)
	})

	test('does not emit when computed value stays the same', () => {
		const component = new Component(mockNode(), {
			data: { count: 1, unrelated: 'a' },
			computed: {
				doubled() {
					return this.data.count * 2
				},
			},
		})
		let changeCount = 0
		component.on('change:doubled', () => {
			changeCount++
		})
		component.data.unrelated = 'b'
		assert(changeCount).isEqual(0)
	})
})

describe('reactive/component: clone', test => {
	test('creates a new scope with provided data', () => {
		const component = new Component(mockNode(), {
			data: { name: 'Original' },
		})
		const cloned = component.clone({ name: 'Cloned' })
		assert(cloned.data.name).isEqual('Cloned')
	})

	test('cloned scope has emit, on, and off', () => {
		const component = new Component(mockNode(), {
			data: {},
		})
		const cloned = component.clone({})
		assert(cloned.emit).notNull()
		assert(cloned.on).notNull()
		assert(cloned.off).notNull()
	})

	test('binds custom methods to the cloned scope', () => {
		const component = new Component(mockNode(), {
			data: {},
			greet() {
				return 'hello'
			},
		})
		const cloned = component.clone({})
		assert(cloned.greet).notNull()
		assert(cloned.greet()).isEqual('hello')
	})

	test('does not copy reserved properties', () => {
		const component = new Component(mockNode(), {
			data: { name: 'Test' },
		})
		const cloned = component.clone({ name: 'Cloned' })
		assert(cloned.node).isNull()
		assert(cloned.mounted).isNull()
		assert(cloned.created).isNull()
	})
})