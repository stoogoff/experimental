
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

	get totalRuns() {
		return this.#runs.length
	}

	get totalSuccesses() {
		return this.successes.length
	}

	get totalFailures() {
		return this.failures.length
	}

	get successes() {
		return this.#runs.filter(run => run instanceof Success)
	}

	get failures() {
		return this.#runs.filter(run => run instanceof Failure)
	}

	render() {
		const summary = [`${this.#description}:`]

		if(this.totalFailures > 0) {
			summary.push(` \x1b[31m Passed ${this.totalSuccesses} of ${this.totalRuns}\x1b[0m`)
		}
		else {
			summary.push(` \x1b[1m\x1b[33mPassed ${this.totalSuccesses} of ${this.totalRuns}\x1b[0m`)
		}

		console.log(summary.join(''))

		this.failures.forEach(run => run.render())
	}
}

export const describe = (description, tests) => {
	const runner = new TestRunner(description)

	function testHandler(description, test) {
		try {
			test()

			runner.success(description)
		}
		catch(error) {
			runner.failure(description, error)
		}
	}

	testHandler.success = () => runner.success('Test passed')
	testHandler.fail = (error) => runner.failure('Test called fail', error)

	tests(testHandler)

	runner.render()	
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
	},
})
