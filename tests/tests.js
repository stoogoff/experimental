
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
	#runs = []
	#before = new CallableStack()
	#after = new CallableStack()

	constructor(description) {
		this.#description = description
	}

	pass(description) {
		this.#runs.push(new Success(description))
	}

	fail(description, error) {
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

	get before() {
		return this.#before
	}

	get after() {
		return this.#after
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
			runner.before.call()
			test()

			runner.pass(description)
			runner.after.call()
		}
		catch(error) {
			runner.fail(description, error)
		}
	}

	// automatic success and failure handlers
	testHandler.pass = () => runner.pass('Test passed')
	testHandler.fail = (error) => runner.fail('Test called fail', error)

	// before and after handlers
	testHandler.before = item => runner.before.add(item)
	testHandler.after = item => runner.after.add(item)

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
