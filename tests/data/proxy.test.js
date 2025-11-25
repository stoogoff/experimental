import { describe, assert } from '../tests.js'
import { getProxy, getProxyByKey, clearAllProxies } from '../../src/data/proxy.js'
import { ProxiedModel } from '../../src/data/model.js'

describe('data/proxy: getProxy', test => {
	test.after(clearAllProxies)

	test('throws an error if no model is set', () => {
		assert(() => getProxy()).throwsError()
	})

	test('returns a proxied model', () => {
		const raw = {
			id: 'test-1',
			name: 'Stoo',
		}
		const model = getProxy(raw)

		assert(model).notNull()
		assert(model.id).isEqual(raw.id)
		assert(model.name).isEqual(raw.name)
		assert(model.on).isFunction()
		assert(model.off).isFunction()
		assert(model.clear).isFunction()
	})

	test('returns the same model each time', () => {
		const raw = {
			id: 'test-2',
			name: 'Stoo',
		}
		const model1 = getProxy(raw)
		const model2 = getProxy(raw)

		assert(model1).notNull()
		assert(model1.id).isEqual(raw.id)
		assert(model1.name).isEqual(raw.name)

		assert(model2).notNull()
		assert(model2.id).isEqual(raw.id)
		assert(model2.name).isEqual(raw.name)

		assert(model1).isEqual(model2)
		assert(model1.id).isEqual(model2.id)
		assert(model1.name).isEqual(model2.name)
	})

	test('uses the specified primary key', () => {
		const raw = {
			uniqueId: 'test-3',
			name: 'Stoo',
		}
		const model = getProxy(raw, 'uniqueId')

		assert(model).notNull()
		assert(model.uniqueId).isEqual(raw.uniqueId)
		assert(model.name).isEqual(raw.name)
		assert(model.on).isFunction()
		assert(model.off).isFunction()
		assert(model.clear).isFunction()
	})
})

describe('data/proxy: getProxyByKey', test => {
	test.after(clearAllProxies)

	test('throws an error if no id is set', () => {
		assert(() => getProxyByKey()).throwsError()
	})

	test("returns null if the object doesn't exist", () => {
		const model = getProxyByKey('nothing')

		assert(model).isNull()
	})

	test('returns a previously set model with a numeric key', () => {
		getProxy({ id: 1, hello: 'World' })

		const model = getProxyByKey(1)

		assert(model).notNull()
		assert(model.id).isEqual(1)
		assert(model.hello).isEqual('World')
	})

	test('returns a previously set model with a string key', () => {
		getProxy({ id: 'test-4', hello: 'World' })

		const model = getProxyByKey('test-4')

		assert(model).notNull()
		assert(model.id).isEqual('test-4')
		assert(model.hello).isEqual('World')
	})

	test('returns a previously set model with a custom key property', () => {
		getProxy({ uniqueId: 'test-5', hello: 'World' }, 'uniqueId')

		const model = getProxyByKey('test-5')

		assert(model).notNull()
		assert(model.uniqueId).isEqual('test-5')
		assert(model.hello).isEqual('World')
	})
})

