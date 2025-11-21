
import { describe, assert } from '../tests.js'
import {
	LOG_LEVEL_INFO,
	LOG_LEVEL_LOG,
	LOG_LEVEL_WARN,
	LOG_LEVEL_ERROR,
	ConsoleLogger,
	NoOpLogger,
	setLogger,
	getLogger,
} from '../../src/utils/logger.js'

describe('utils/logger: constants', test => {
	test('log level constants have expected numeric values', () => {
		assert(LOG_LEVEL_INFO).isEqual(1)
		assert(LOG_LEVEL_LOG).isEqual(2)
		assert(LOG_LEVEL_WARN).isEqual(3)
		assert(LOG_LEVEL_ERROR).isEqual(4)
	})
})

describe('utils/logger: ConsoleLogger', test => {
	test('all methods forward to console methods', () => {
		const calls = { info: 0, log: 0, warn: 0, error: 0 }
		const original = {
			info: console.info,
			log: console.log,
			warn: console.warn,
			error: console.error
		}

		console.info = () => ++calls.info
		console.log = () => ++calls.log
		console.warn = () => ++calls.warn
		console.error = () => ++calls.error

		ConsoleLogger.info('a')
		ConsoleLogger.log('b')
		ConsoleLogger.warn('c')
		ConsoleLogger.error('d')

		assert(calls.info).isEqual(1)
		assert(calls.log).isEqual(1)
		assert(calls.warn).isEqual(1)
		assert(calls.error).isEqual(1)

		// restore console methods
		console.info = original.info
		console.log = original.log
		console.warn = original.warn
		console.error = original.error
	})
})

describe('utils/logger: NoOpLogger', test => {
	test('all methods do nothing', () => {
		let count = 0
		const fn = () => ++count

		// Temporarily swap console to detect accidental calls
		const original = console.log
		console.log = fn

		NoOpLogger.info('x')
		NoOpLogger.log('y')
		NoOpLogger.warn('z')
		NoOpLogger.error('w')

		assert(count).isEqual(0)

		console.log = original
	})
})

describe('utils/logger: setLogger / getLogger', test => {
	const emptyTestLogger = {
		info: () => {},
		log: () => {},
		warn: () => {},
		error: () => {},
	}

	test('returns a NoOpLogger if no logger has been set', () => {
		const logger = getLogger('unregistered-key')

		assert(logger).isEqual(NoOpLogger)
	})

	test('returns a NoOpLogger if no logger has been set for the key', () => {
		setLogger('log-key', emptyTestLogger)

		const logger = getLogger('unregistered-key')

		assert(logger).isEqual(NoOpLogger)
	})

	test('throws an error if log key is not set', () => {
		assert(() => setLogger(null, emptyTestLogger)).throwsError()
	})

	test('throws an error if logger is not set', () => {
		assert(() => setLogger('log-key')).throwsError()
	})
})

describe('utils/logger: logger behaviour', test => {
	const LOG_KEY = 'log-key'

	test('retrieved logger uses provided prefix', () => {
		let captured = null
		const testLogger = {
			info: () => {},
			log: () => {},
			warn: (...args) => captured = args,
			error: () => {},
		}

		setLogger(LOG_KEY, testLogger, LOG_LEVEL_WARN)

		const logger = getLogger(LOG_KEY)

		logger.warn('hello', 42)

		assert(captured).notNull()
		assert(captured[0]).isEqual('LOG-KEY:')
		assert(captured[1]).isEqual('hello')
		assert(captured[2]).isEqual(42)
	})

	test('a logger set to LOG_LEVEL_INFO responds to all log calls', () => {
		let calls = { info: 0, log: 0, warn: 0, error: 0 }
		const testLogger = {
			info: () => ++calls.info,
			log: () => ++calls.log,
			warn: () => ++calls.warn,
			error: () => ++calls.error,
		}

		setLogger(LOG_KEY, testLogger, LOG_LEVEL_INFO)

		const logger = getLogger(LOG_KEY)

		logger.info('info')
		logger.log('log')
		logger.warn('warn')
		logger.error('error')

		assert(calls.info).isEqual(1)
		assert(calls.log).isEqual(1)
		assert(calls.warn).isEqual(1)
		assert(calls.error).isEqual(1)
	})

	test('a logger set to LOG_LEVEL_LOG ignores info calls', () => {
		let calls = { info: 0, log: 0, warn: 0, error: 0 }
		const testLogger = {
			info: () => ++calls.info,
			log: () => ++calls.log,
			warn: () => ++calls.warn,
			error: () => ++calls.error,
		}

		setLogger(LOG_KEY, testLogger, LOG_LEVEL_LOG)

		const logger = getLogger(LOG_KEY)

		logger.info('info')
		logger.log('log')
		logger.warn('warn')
		logger.error('error')

		assert(calls.info).isEqual(0)
		assert(calls.log).isEqual(1)
		assert(calls.warn).isEqual(1)
		assert(calls.error).isEqual(1)
	})

	test('a logger set to LOG_LEVEL_WARN ignores info and log calls', () => {
		let calls = { info: 0, log: 0, warn: 0, error: 0 }
		const testLogger = {
			info: () => ++calls.info,
			log: () => ++calls.log,
			warn: () => ++calls.warn,
			error: () => ++calls.error,
		}

		setLogger(LOG_KEY, testLogger, LOG_LEVEL_WARN)

		const logger = getLogger(LOG_KEY)

		logger.info('info')
		logger.log('log')
		logger.warn('warn')
		logger.error('error')

		assert(calls.info).isEqual(0)
		assert(calls.log).isEqual(0)
		assert(calls.warn).isEqual(1)
		assert(calls.error).isEqual(1)
	})

	test('a logger set to LOG_LEVEL_ERROR only responds to error calls', () => {
		let calls = { info: 0, log: 0, warn: 0, error: 0 }
		const testLogger = {
			info: () => ++calls.info,
			log: () => ++calls.log,
			warn: () => ++calls.warn,
			error: () => ++calls.error,
		}

		setLogger(LOG_KEY, testLogger, LOG_LEVEL_ERROR)

		const logger = getLogger(LOG_KEY)

		logger.info('info')
		logger.log('log')
		logger.warn('warn')
		logger.error('error')

		assert(calls.info).isEqual(0)
		assert(calls.log).isEqual(0)
		assert(calls.warn).isEqual(0)
		assert(calls.error).isEqual(1)
	})
})
