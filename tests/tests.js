
class Success {
	#description

	constructor(description) {
		this.#description = `  ✔ ${description}`
	}

	toString() {
		return this.#description
	}
}

class Failure {
	#description

	constructor(description, error) {
		this.#description = `  ✘ ${description}\n  ${error}`
	}

	toString() {
		return this.#description
	}
}

class CallableStack {
	#stack = []

	add(item) {
		this.#stack.push(item)
	}

	call() {
		this.#stack.forEach(item => item())
	}
}

class TestRunner {
	#description
	#tests
	#runs = []
	#before = new CallableStack()
	#after = new CallableStack()

	constructor(description, tests) {
		this.#description = description
		this.#tests = tests
	}

	pass(description) {
		this.#runs.push(new Success(description))
	}

	fail(description, error) {
		this.#runs.push(new Failure(description, error))
	}

	get description() {
		return this.#description
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

	run() {
		function testHandler(description, test) {
			try {
				this.#before.call()
				test()

				this.pass(description)
				this.#after.call()
			}
			catch(error) {
				this.fail(description, error)
			}
		}

		testHandler = testHandler.bind(this)

		// automatic success and failure handlers
		testHandler.pass = () => this.pass('Test passed')
		testHandler.fail = (error) => this.fail('Test called fail', error)

		// before and after handlers
		testHandler.before = item => this.#before.add(item)
		testHandler.after = item => this.#after.add(item)

		this.#tests(testHandler)
	}
}

const _runners = []

export const run = renderer => {
	_runners.forEach(runner => {
		runner.run()
	})

	renderer(_runners)
}

export const describe = (description, tests) => {
	const runner = new TestRunner(description, tests)

	_runners.push(runner)
}

export const consoleRenderer = runners => {
	const results = {
		passed: 0,
		failed: 0,
		suites: runners.length,
	}

	runners.forEach(runner => {
		results.passed += runner.totalSuccesses
		results.failed += runner.totalFailures

		const summary = [`${runner.description}`]

		if(runner.totalFailures > 0) {
			summary.push(`\x1b[31mPassed ${runner.totalSuccesses} of ${runner.totalRuns}\x1b[0m`)
		}
		else {
			summary.push(`\x1b[1m\x1b[33mPassed ${runner.totalSuccesses} of ${runner.totalRuns}\x1b[0m`)
		}

		console.log(summary.join(' '))

		runner.failures.forEach(run => console.log(`\x1b[31m${run}\x1b[0m`))
	})

	const summary = `Suites: ${results.suites}. Passed: ${results.passed}. `
	const failed = `Failed: ${results.failed}.`
	const bar = [...new Array((summary + failed).length) ].map(_ => '-').join('')

	console.log(bar)
	console.log(summary + (results.failed > 0 ? `\x1b[1m\x1b[31m${failed}\x1b[0m` : failed))
	console.log(bar)
}

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
