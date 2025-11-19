
import { isNull } from '../utils/assert.js'

// subscribe / publish handler
export class Emitter {
	#ref = 0
	#events = {}

	// emit calls any functions which are mapped to the supplied string. All parameters after the first are passed to each
	// function that is called.
	emit(event, ...args) {
		if(isNull(this.#events[event])) {
			return false
		}

		const evt = this.#events[event]

		for(let i in evt) {
			evt[i](...args)
		}

		return true
	}

	// Link the supplied callback function to supplied event string.
	on(event, callback) {
		if(isNull(this.#events[event])) {
			this.#events[event] = {}
		}

		const ref = "evt_" + (++this.#ref)

		this.#events[event][ref] = callback

		return ref
	}

	// Delete the referenced function from the event.
	off(event, reference) {
		if(isNull(this.#events[event])) {
			return false
		}

		delete this.#events[event][reference]

		return true
	}

	clear() {
		this.#events = {}
	}
}
