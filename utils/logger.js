
export const ConsoleLogger = {
	log(...args) {
		console.log(...args)
	},

	error(...args) {
		console.error(...args)
	},

	warn(...args) {
		console.warn(...args)
	},
}

const noop = () => {}

export const NoOpLogger = {
	log: Noop,
	error: Noop,
	warn: Noop,
}
