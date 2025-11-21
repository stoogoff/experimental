import { describe, assert } from '../tests.js'
import { Storage } from '../../src/utils/storage.js'

/**
 * Simple mock implementation of localStorage/sessionStorage
 */
class MockStorage {
	#store

	constructor() {
		this.#store = {}
	}

	get length() {
		return Object.keys(this.#store).length
	}

	setItem(key, value) {
		this.#store[key] = value
	}

	getItem(key) {
		return this.#store[key] ?? null
	}

	removeItem(key) {
		delete this.#store[key]
	}

	clear() {
		this.#store = {}
	}

	key(index) {
		return Object.keys(this.#store)[index] || null
	}
}

describe('utils/storage: set/get', test => {
	test('stores and retrieves JSON values', () => {
		const mock = new MockStorage()
		const storage = new Storage(mock)

		const value = { a: 1, b: true, c: [1, 2, 3] }

		storage.set('test', value)
		const result = storage.get('test')

		assert(result.a).isEqual(1)
		assert(result.b).isEqual(true)
		assert(result.c).isEqual([1, 2, 3])
	})

	test('returns null for missing keys', () => {
		const mock = new MockStorage()
		const storage = new Storage(mock)

		const result = storage.get('missing')

		assert(result).isNull()
	})

	test('get throws an error if no key is provided', () => {
		const mock = new MockStorage()
		const storage = new Storage(mock)

		assert(() => storage.get()).throwsError()
	})

	test('set throws an error if no key is provided', () => {
		const mock = new MockStorage()
		const storage = new Storage(mock)

		assert(() => storage.set(null, 'value')).throwsError()
	})

	test('set throws an error if no value is provided', () => {
		const mock = new MockStorage()
		const storage = new Storage(mock)

		assert(() => storage.set('key')).throwsError()
	})
})

describe('utils/storage: has', test => {
	test('returns true when key exists', () => {
		const mock = new MockStorage()
		const storage = new Storage(mock)

		storage.set('exists', 123)

		assert(storage.has('exists')).isTrue()
	})

	test('returns false when key is missing', () => {
		const mock = new MockStorage()
		const storage = new Storage(mock)

		assert(storage.has('nope')).isFalse()
	})
})

describe('utils/storage: keys', test => {
	test('returns all keys in storage', () => {
		const mock = new MockStorage()
		const storage = new Storage(mock)

		storage.set('one', 1)
		storage.set('two', 2)
		storage.set('three', 3)

		const keys = storage.keys()

		assert(keys.includes('one')).isTrue()
		assert(keys.includes('two')).isTrue()
		assert(keys.includes('three')).isTrue()
		assert(keys.length).isEqual(3)
	})

	test('returns empty array when storage empty', () => {
		const storage = new Storage(new MockStorage())
		assert(storage.keys()).isEqual([])
	})
})

describe('utils/storage: remove', test => {
	test('removes one or multiple keys', () => {
		const mock = new MockStorage()
		const storage = new Storage(mock)

		storage.set('a', 1)
		storage.set('b', 2)
		storage.set('c', 3)

		storage.remove('a', 'c')

		assert(storage.has('a')).isFalse()
		assert(storage.has('c')).isFalse()
		assert(storage.has('b')).isTrue()
	})
})

describe('utils/storage: clear', test => {
	test('clears all items from storage', () => {
		const mock = new MockStorage()
		const storage = new Storage(mock)

		storage.set('x', 1)
		storage.set('y', 2)

		storage.clear()

		assert(storage.keys()).isEqual([])
		assert(storage.has('x')).isFalse()
		assert(storage.has('y')).isFalse()
	})
})
