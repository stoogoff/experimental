
import { describe, assert } from '../../src/test/index.js'
import { SetStore } from '../../src/data/set-store.js'
import { getProxy, clearAllProxies } from '../../src/data/proxy.js'

describe('data/set-store: constructor', test => {
	test.after(clearAllProxies)

	test('initialises empty when no data is given', () => {
		const store = new SetStore()

		assert(store.all.length).isEqual(0)
	})

	test('wraps initial items with getProxy', () => {
		const model = { id: 1 }
		const store = new SetStore([model])

		assert(store.all[0]).notNull()
		assert(store.all[0].model).isEqual(model)
	})
})

describe('data/set-store: add', test => {
	test.after(clearAllProxies)

	test('adds proxied item to internal array', () => {
		const store = new SetStore([], 'id')

		const item = { id: 10 }
		const result = store.add(item)

		assert(result).isEqual(item)
		assert(store.all.length).isEqual(1)
		assert(store.all[0].id).isEqual(10)
	})

	test('emits "add" with proxied item', () => {
		const store = new SetStore()
		let emittedItem = null

		store.on('add', proxied => {
			emittedItem = proxied
		})

		store.add({ id: 2 })

		assert(emittedItem.id).isEqual(2)
	})

	test('emits "change:all" event when an item is added', () => {
		const store = new SetStore()
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

describe('data/set-store: addRange', test => {
	test.after(clearAllProxies)

	test('adds multiple proxied items to internal array', () => {
		const store = new SetStore()
		const items = [{ id: 1 }, { id: 2 }]

		const result = store.addRange(items)

		assert(result).isEqual(items)
		assert(store.all.length).isEqual(2)
		assert(store.all[0].id).isEqual(1)
		assert(store.all[1].id).isEqual(2)
	})

	test('emits "add" for each added item', () => {
		const store = new SetStore()
		const added = []

		store.on('add', item => {
			added.push(item)
		})

		store.addRange([{ id: 10 }, { id: 20 }])

		assert(added.length).isEqual(2)
		assert(added[0].id).isEqual(10)
		assert(added[1].id).isEqual(20)
	})

	test('emits "change:all" once after adding range', () => {
		const store = new SetStore()
		let args = null
		let callCount = 0

		store.on('change:all', (field, value) => {
			args = [field, value]
			callCount++
		})

		store.addRange([{ id: 1 }, { id: 2 }, { id: 3 }])

		assert(callCount).isEqual(1)
		assert(args[0]).isEqual('all')
		assert(args[1].length).isEqual(3)
	})
})

describe('data/set-store: remove', test => {
	test.after(clearAllProxies)

	test('removes item matching key', () => {
		const store = new SetStore([{ id: 1 }, { id: 2 }])

		assert(store.all.length).isEqual(2)

		store.remove({ id: 1 })

		assert(store.all[0].id).isEqual(2)
	})

	test('returns proxied removed item', () => {
		const store = new SetStore([{ id: 5 }])

		const result = store.remove({ id: 5 })

		assert(result.id).isEqual(5)
	})

	test('emits "remove" with proxied item', () => {
		const store = new SetStore([{ id: 10 }])
		let emitted = null

		store.on('remove', item => {
			emitted = item
		})

		store.remove({ id: 10 })

		assert(emitted.id).isEqual(10)
	})

	test('emits "change:all" after removal', () => {
		const store = new SetStore([{ id: 1 }, { id: 2 }])
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

describe('data/set-store: empty', test => {
	test.after(clearAllProxies)

	test('removes all items from the store', () => {
		const store = new SetStore([{ id: 1 }, { id: 2 }])

		assert(store.all.length).isEqual(2)

		store.empty()

		assert(store.all.length).isEqual(0)
	})

	test('emits "remove" for each removed item', () => {
		const store = new SetStore([{ id: 1 }, { id: 2 }])
		const removed = []

		store.on('remove', item => {
			removed.push(item)
		})

		store.empty()

		assert(removed.length).isEqual(2)
		assert(removed[0].id).isEqual(1)
		assert(removed[1].id).isEqual(2)
	})

	test('emits "change:all" after emptying the store', () => {
		const store = new SetStore([{ id: 5 }])
		let args = null
		let callCount = 0

		store.on('change:all', (field, value) => {
			args = [field, value]
			callCount++
		})

		store.empty()

		assert(callCount).isEqual(1)
		assert(args[0]).isEqual('all')
		assert(args[1].length).isEqual(0)
	})

	test('does nothing when empty is called on an empty store', () => {
		const store = new SetStore()
		let called = false

		store.on('change:all', () => {
			called = true
		})

		store.empty()

		assert(called).isEqual(false)
	})
})