
import { Failure } from './failure.js'
import { Success } from './success.js'
import { CallableStack } from './callable-stack.js'

export class TestRunner {
	#description
	#tests
	#runs = []
	#before = new CallableStack()
	#after = new CallableStack()

	constructor(description, tests) {
		this.#description = description
		this.#tests = tests
	}

	pass(description, time) {
		this.#runs.push(new Success(description, time))
	}

	fail(description, error, time) {
		this.#runs.push(new Failure(description, error, time))
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
			const now = Date.now()

			try {
				this.#before.call()

				test()

				this.pass(description, Date.now() - now)
				this.#after.call()
			}
			catch(error) {
				this.fail(description, error, Date.now() - now)
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
