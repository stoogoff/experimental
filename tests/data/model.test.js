import { describe, assert } from '../tests.js'
import { ProxiedModel } from '../../src/data/model.js'

describe('data/model: basic proxy behavior', test => {
	test('returns a proxy object, not the original', () => {
		const model = { a: 1 }
		const proxied = new ProxiedModel(model)

		assert(proxied).notEqual(model)
		assert(proxied.model).isEqual(model)
	})

	test('gets underlying property values', () => {
		const model = { a: 123 }
		const proxied = new ProxiedModel(model)

		assert(proxied.a).isEqual(123)
	})

	test('sets underlying property values', () => {
		const model = { a: 1 }
		const proxied = new ProxiedModel(model)

		proxied.a = 99
		assert(model.a).isEqual(99)
	})

	test("does not overwrite 'model' property value", () => {
		const model = { a: 1 }
		const proxied = new ProxiedModel(model)

		assert(() => proxied.model = { b: 1 }).throwsError()
	})

	test("does not emit when value hasn't changed", () => {
		const model = { x: 10 }
		const proxied = new ProxiedModel(model)

		let callCount = 0
		proxied.on('change:x', () => callCount++)

		proxied.x = 10

		assert(callCount).isEqual(0)
	})
})

describe('data/model: event emission', test => {
	test('emits "change" event with correct arguments', () => {
		const model = { x: 1 }
		const proxied = new ProxiedModel(model)

		let received = null

		proxied.on('change', (prop, newValue, oldValue) => {
			received = [prop, newValue, oldValue]
		})

		proxied.x = 2

		assert(received).isArray()
		assert(received.length).isEqual(3)
		assert(received[0]).isEqual('x')
		assert(received[1]).isEqual(2)
		assert(received[2]).isEqual(1)
	})

	test('emits "change:prop" event with correct arguments', () => {
		const model = { y: 20 }
		const proxied = new ProxiedModel(model)

		let received = null

		proxied.on('change:y', (prop, newValue, oldValue) => {
			received = [prop, newValue, oldValue]
		})

		proxied.y = 99

		assert(received).isArray()
		assert(received.length).isEqual(3)
		assert(received[0]).isEqual('y')
		assert(received[1]).isEqual(99)
		assert(received[2]).isEqual(20)
	})

	test('change event fires before change:prop (ordering)', () => {
		const model = { z: 1 }
		const proxied = new ProxiedModel(model)

		const calls = []

		proxied.on('change', () => calls.push('change'))
		proxied.on('change:z', () => calls.push('change:z'))

		proxied.z = 2

		assert(calls).isEqual(['change', 'change:z'])
	})
})

describe('data/model: on/off', test => {
	test('on registers handlers and returns unique references', () => {
		const proxied = new ProxiedModel({})

		const a = proxied.on('change', () => {})
		const b = proxied.on('change', () => {})

		assert(a).notEqual(b)
		assert(a.startsWith('evt_')).isTrue()
		assert(b.startsWith('evt_')).isTrue()
	})

	test('off unregisters handler and it no longer fires', () => {
		const model = { q: 10 }
		const proxied = new ProxiedModel(model)

		let callCount = 0
		const ref = proxied.on('change:q', () => callCount++)

		proxied.off('change:q', ref)
		proxied.q = 11

		assert(callCount).isEqual(0)
	})

	test('off returns false for unknown event', () => {
		const proxied = new ProxiedModel({})

		const out = proxied.off('missing', 'evt_x')
		assert(out).isFalse()
	})
})

describe('data/model: clear', test => {
	test('clear removes all handlers for all events', () => {
		const model = { a: 1 }
		const proxied = new ProxiedModel(model)

		proxied.on('change', () => test.fail('should not fire: change'))
		proxied.on('change:a', () => test.fail('should not fire: change:a'))

		proxied.clear()

		proxied.a = 2
		test.success()
	})
})
