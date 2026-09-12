
import { Emitter } from './emitter.js'

/**
 * Helper class for anything which contains an emitter rather
 * than extending from it.
 */
export class Emittable {
	_emitter

	constructor() {
		this._emitter = new Emitter()
	}

	// Emitter methods

	on(event, callback) {
		return this._emitter.on(event, callback)
	}

	off(event, reference) {
		return this._emitter.off(event, reference)
	}

	clear() {
		this._emitter.clear()
	}
}
