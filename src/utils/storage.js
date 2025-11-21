
import { notNull, notString, throwIfNull } from './assert.js'

// wrapper around localStorage and sessionStorage
// which automatically converts data to and from JSON
export class Storage {
	constructor(storage) {
		this.storage = storage
	}

	/**
	 * Adds data to storage for the given key.
	 * @param {string} key - The key to store the data under.
	 * @param {*} value - The data to store.
	 */
	set(key, value) {
		throwIfNull(key, 'key')
		throwIfNull(value, 'value')

		if(notString(key)) throw new Error('key must be a string')

		this.storage.setItem(key, JSON.stringify(value))
	}

	/**
	 * Returns the data stored for the given key.
	 * @param {string} key - The key to look for.
	 * @return {*}
	 */
	get(key) {
		throwIfNull(key, 'key')

		return JSON.parse(this.storage.getItem(key))
	}

	/**
	 * Returns true if the given key exists in storage.
	 * @param {string} key - The key to look for.
	 * @return {boolean} True if the key is found, false otherwise.
	 */
	has(key) {
		throwIfNull(key, 'key')

		return notNull(this.storage.getItem(key))
	}

	/**
	 * Returns all keys in storage as an array of strings.
	 * @return {string[]} The keys.
	 */
	keys() {
		let keys = []

		for(let i = 0, len = this.storage.length; i < len; ++i) {
			keys.push(this.storage.key(i))
		}

		return keys
	}

	/**
	 * Remove any item from storage with the given keys.
	 * @example
	 * local.remove('a', 'b')
	 * @param {...string} keys - The keys to be removed.
	 */
	remove(...keys) {
		keys.forEach(key => this.storage.removeItem(key))
	}

	/**
	 * Remove all items in storage.
	 */
	clear() {
		this.storage.clear()
	}
}

const noop = () => {}

const emptyStorage = {
	length: 0,
	setItem: noop,
	getItem: noop,
	removeItem: noop,
	clear: noop,
	key: noop,
}

var window = window ?? null

export const local = new Storage(window && window.localStorage ? window.localStorage : emptyStorage)
export const session = new Storage(window && window.sessionStorage ? window.sessionStorage : emptyStorage)
