
export { assert } from './assert.js'
export { consoleRenderer } from './console-renderer.js'
export { MockNode } from './mock-node.js'

import { TestRunner } from './test-runner.js'

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
