
export const assert = target => ({
	isEqual(value) {
		if (
			target === value || (
				typeof target === 'object' &&
				typeof value === 'object' &&
				target.length === value.length &&
				(target.every && target.every((element, index) => element === value[index]))
			)
		) {
			return
		}
		else {
			throw new Error(`${target} !== ${value}`)
		}
	},

	notEqual(value) {
		if (
			target === value || (
				typeof target === 'object' &&
				typeof value === 'object' &&
				target.length === value.length &&
				(target.every && target.every((element, index) => element === value[index]))
			)
		) {
			throw new Error(`${target} === ${value}`)
		}
	},

	isTrue() {
		this.isEqual(true)
	},

	isFalse() {
		this.isEqual(false)
	},

	notNull() {
		if(target === null || target === undefined) {
			throw new Error(`Null or undefined: ${target}`)
		}
	},

	isNull() {
		if(target !== null && target !== undefined) {
			throw new Error(`Expected null or undefined: ${target}`)
		}
	},

	isFunction() {
		this.notNull()

		if(typeof target !== 'function') {
			throw new Error(`Not a function: ${target}`)
		}
	},

	isArray() {
		this.notNull()

		if(!Array.isArray(target)) {
			throw new Error(`Not an array: ${target}`)
		}
	},

	isError() {
		if(!(target instanceof Error)) {
			throw new Error(`Not an error object: ${target}`)
		}
	},

	throwsError() {
		try {
			target()
		}
		catch(error) {
			assert(error).isError()

			return
		}

		throw new Error('Function did not throw:', target)
	},
})
