
class Success {
	#description

	constructor(description) {
		this.#description = `  ✔ ${description}`
	}

	render() {
		console.log(this.#description)
	}
}

class Failure {
	#description

	constructor(description, error) {
		this.#description = `\x1b[31m✘ ${description}\n  ${error}\x1b[0m`
	}

	render() {
		console.log(this.#description)
	}
}

class TestRunner {
	#description
	#runs = []

	constructor(description) {
		this.#description = description
	}

	success(description) {
		this.#runs.push(new Success(description))
	}

	failure(description, error) {
		this.#runs.push(new Failure(description, error))
	}

	render() {
		const total = this.#runs.length
		const successes = this.#runs.filter(run => run instanceof Success).length
		const failures = this.#runs.filter(run => run instanceof Failure)

		const summary = [`${this.#description}:`]

		if(failures.length > 0) {
			summary.push(` \x1b[31m Passed ${successes} of ${total}\x1b[0m`)
		}
		else {
			summary.push(` \x1b[1m\x1b[33mPassed ${successes} of ${total}\x1b[0m`)
		}

		console.log(summary.join(''))

		failures.forEach(run => run.render())
	}
}

const runners = []

const getCurrentRunner = () => {
	if(runners.length === 0) {
		throw new Error('No runners set')
	}

	return runners[runners.length - 1]
}


export const describe = (description, tests) => {
	const runner = new TestRunner(description)

	runners.push(runner)

	tests()

	runner.render()	
}

export const test = (description, test) => {
	const runner = getCurrentRunner()

	try {
		test()
		
		runner.success(description)
	}
	catch(error) {
		runner.failure(description, error)
	}
}

export const assert = target => ({
	isEqual(value) {
		if (
			target === value || (
				typeof target === 'object' &&
				typeof value === 'object' &&
				target.length === value.length &&
				target.every((element, index) => element === value[index])
			)
		) {
			return
		} else {
			throw new Error(`${target} !== ${value}`)
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
			throw new Error(`Null of undefined: ${target}`)
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
	}
})
