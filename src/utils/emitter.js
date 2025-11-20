
import { isNull, throwIfNull } from './assert.js'

/** 
 * Subscribe / publish handler
 */
export class Emitter {
	#ref = 0
	#events = {}

	/**
	 * Emit an event and call any functions registered to it with the supplied arguments.
	 * @param {string} event - The name of the event to emit.
	 * @param {any[]} args - The remaining arguments which are sent 
	 * @return {boolean} Returns false if no events are registered, otherwise true.
	 */
	emit(event, ...args) {
		throwIfNull(event, 'event')

		if(isNull(this.#events[event])) {
			return false
		}

		const evt = this.#events[event]

		for(let i in evt) {
			evt[i](...args)
		}

		return true
	}

	/**
	 * Link the supplied callback function to supplied event string.
	 * @param {string} event - The name of the event.
	 * @param {function} callback - The function to call when the event fires.
	 * @return {string} The reference to use to unregister from the event.
	 */
	on(event, callback) {
		throwIfNull(event, 'event')
		throwIfNull(callback, 'callback')

		if(isNull(this.#events[event])) {
			this.#events[event] = {}
		}

		const ref = "evt_" + (++this.#ref)

		this.#events[event][ref] = callback

		return ref
	}

	/**
	 * Delete the referenced function from the event.
	 * @param {string} event - The event to unregister from.
	 * @param {string} reference - The reference returned when registering for the event.
	 * @return {boolean} Returns true on success.
	 */
	off(event, reference) {
		throwIfNull(event, 'event')
		throwIfNull(reference, 'reference')

		if(isNull(this.#events[event])) {
			return false
		}

		delete this.#events[event][reference]

		return true
	}

	/**
	 * Remove all events.
	 */
	clear() {
		this.#events = {}
	}
}
