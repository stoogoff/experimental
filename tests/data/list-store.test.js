
import { describe, assert } from '../../src/test/index.js'
import { ListStore } from '../../src/data/list-store.js'
import { getProxy, clearAllProxies } from '../../src/data/proxy.js'

describe('data/list-store: constructor', test => {
	test.after(clearAllProxies)

	test('initialises empty when no data is given', () => {
		const store = new ListStore()

		assert(store.all.length).isEqual(0)
	})

	test('wraps initial items with getProxy', () => {
		const model = { id: 1 }
		const store = new ListStore([model])

		assert(store.all[0]).notNull()
		assert(store.all[0].model).isEqual(model)
	})
})

describe('data/list-store: add', test => {
	test.after(clearAllProxies)

	test('adds proxied item to internal array', () => {
		const store = new ListStore([], 'id')

		const item = { id: 10 }
		const result = store.add(item)

		assert(result).isEqual(item)
		assert(store.all.length).isEqual(1)
		assert(store.all[0].id).isEqual(10)
	})

	test('emits "add" with proxied item', () => {
		const store = new ListStore()
		let emittedItem = null

		store.on('add', proxied => {
			emittedItem = proxied
		})

		store.add({ id: 2 })

		assert(emittedItem.id).isEqual(2)
	})

	test('emits "change:all" event when an item is added', () => {
		const store = new ListStore()
		let args = null

		store.on('change:all', (field, value) => {
			args = [field, value]
		})

		const a = { id: 10 }
		const b = { id: 20 }

		store.add(a)

		assert(args[0]).isEqual('all')
		assert(args[1].length).isEqual(1)

		store.add(b)

		assert(args[0]).isEqual('all')
		assert(args[1].length).isEqual(2)
	})
})

describe('data/list-store: remove', test => {
	test.after(clearAllProxies)

	test('removes item matching key', () => {
		const store = new ListStore([{ id: 1 }, { id: 2 }])

		assert(store.all.length).isEqual(2)

		store.remove({ id: 1 })

		assert(store.all[0].id).isEqual(2)
	})

	test('returns proxied removed item', () => {
		const store = new ListStore([{ id: 5 }])

		const result = store.remove({ id: 5 })

		assert(result.id).isEqual(5)
	})

	test('emits "remove" with proxied item', () => {
		const store = new ListStore([{ id: 10 }])
		let emitted = null

		store.on('remove', item => {
			emitted = item
		})

		store.remove({ id: 10 })

		assert(emitted.id).isEqual(10)
	})

	test('emits "change:all" after removal', () => {
		const store = new ListStore([{ id: 1 }, { id: 2 }])
		let args = null

		store.on('change:all', (field, value) => {
			args = [field, value]
		})

		store.remove({ id: 2 })

		assert(args[0]).isEqual('all')
		assert(args[1].length).isEqual(1)
		assert(args[1][0].id).isEqual(1)
	})
})
