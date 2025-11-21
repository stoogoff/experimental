
import { throwIfNull } from './assert.js'

export const LOG_LEVEL_INFO = 1
export const LOG_LEVEL_LOG = 2
export const LOG_LEVEL_WARN = 3
export const LOG_LEVEL_ERROR = 4

export const ConsoleLogger = {
	info(...args) {
		console.info(...args)
	},
	log(...args) {
		console.log(...args)
	},
	warn(...args) {
		console.warn(...args)
	},
	error(...args) {
		console.error(...args)
	},
}

const noop = () => {}

export const NoOpLogger = {
	info: noop,
	log: noop,
	warn: noop,
	error: noop,
}

class WrappedLogger {
	#key
	#logger
	#level

	constructor(key, logger, level) {
		this.#key = key.toUpperCase() + ':'
		this.#logger = logger
		this.#level = level
	}

	info(...args) {
		if(this.#level <= LOG_LEVEL_INFO) this.#logger.info(this.#key, ...args)
	}
	log(...args) {
		if(this.#level <= LOG_LEVEL_LOG) this.#logger.log(this.#key, ...args)
	}
	warn(...args) {
		if(this.#level <= LOG_LEVEL_WARN) this.#logger.warn(this.#key, ...args)
	}
	error(...args) {
		if(this.#level <= LOG_LEVEL_ERROR) this.#logger.error(this.#key, ...args)
	}
}

const _loggers = {}

export const setLogger = (key, logger, level = LOG_LEVEL_WARN) => {
	throwIfNull(key, 'key')
	throwIfNull(logger, 'logger')

	_loggers[key] = new WrappedLogger(key, logger, level)
}

export const getLogger = key => _loggers[key] ?? NoOpLogger
