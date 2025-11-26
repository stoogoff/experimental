import { describe, assert } from '../tests.js'
import { Emitter } from '../../src/utils/emitter.js'

describe('utils/emitter: emit', test => {
	test('returns false when no handlers exist', () => {
		const emitter = new Emitter()
		const output = emitter.emit('nothing')

		assert(output).isFalse()
	})

	test('invokes all registered handlers with arguments', () => {
		const emitter = new Emitter()
		let callCount = 0

		emitter.on('event', (a, b) => {
			assert(a).isEqual(10)
			assert(b).isEqual(20)
			++callCount
		})

		emitter.on('event', (a, b) => {
			assert(a).isEqual(10)
			assert(b).isEqual(20)
			++callCount
		})

		const output = emitter.emit('event', 10, 20)

		assert(output).isTrue()
		assert(callCount).isEqual(2)
	})

	test("doesn't invoke handlers with a different event name", () => {
		const emitter = new Emitter()
		let callCount = 0

		emitter.on('event', (a, b) => {
			assert(a).isEqual(10)
			assert(b).isEqual(20)
			++callCount
		})

		emitter.on('noevent', (a, b) => {
			test.fail()
			++callCount
		})

		const output = emitter.emit('event', 10, 20)

		assert(output).isTrue()
		assert(callCount).isEqual(1)
	})

	test('throws an error if no input provided', () => {
		const emitter = new Emitter()

		assert(() => emitter.emit()).throwsError()
	})
})

describe('utils/emitter: on', test => {
	test('returns unique references', () => {
		const emitter = new Emitter()

		const a = emitter.on('click', () => {})
		const b = emitter.on('click', () => {})

		assert(a).notEqual(b)
		assert(a.startsWith('evt_')).isTrue()
		assert(b.startsWith('evt_')).isTrue()
	})

	test('throws an error if no event provided', () => {
		const emitter = new Emitter()

		assert(() => emitter.on()).throwsError()
	})

	test('throws an error if no callback provided', () => {
		const emitter = new Emitter()

		assert(() => emitter.on('event')).throwsError()
	})
})

describe('utils/emitter: off', test => {
	test('returns false when event does not exist', () => {
		const emitter = new Emitter()
		const output = emitter.off('nope', 'evt_1')

		assert(output).isFalse()
	})

	test('unregisters a handler and emit no longer calls it', () => {
		const emitter = new Emitter()
		const ref = emitter.on('event', () => {
			test.fail('Event handler called')
		})

		emitter.off('event', ref)
		emitter.emit('event', 10, 20)

		test.pass()
	})

	test('throws an error if no event provided', () => {
		const emitter = new Emitter()

		assert(() => emitter.off()).throwsError()
	})

	test('throws an error if no reference provided', () => {
		const emitter = new Emitter()

		assert(() => emitter.off('event')).throwsError()
	})
})

describe('utils/emitter: clear', test => {
	test('removes all handlers', () => {
		const emitter = new Emitter()

		emitter.on('event', () => {
			test.fail('Event handler called')
		})

		emitter.on('click', () => {
			test.fail('Event handler called')
		})

		emitter.clear()
		emitter.emit('event')
		emitter.emit('click')
		test.pass()
	})
})
