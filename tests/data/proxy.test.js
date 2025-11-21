import { describe, assert } from '../tests.js'
import { getProxy } from '../../src/data/proxy.js'
import { ProxiedModel } from '../../src/data/model.js'

describe('data/proxy: getProxy', test => {
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
