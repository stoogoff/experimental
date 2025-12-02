
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

		//runner.successes.forEach(run => console.log(run.toString()))
		runner.failures.forEach(run => console.log(`\x1b[31m${run}\x1b[0m`))
	})

	const summary = `Suites: ${results.suites}. Tests: ${results.passed}. `
	const failed = `Failed: ${results.failed}.`
	const bar = [...new Array((summary + failed).length) ].map(_ => '-').join('')

	console.log(bar)
	console.log(summary + (results.failed > 0 ? `\x1b[1m\x1b[31m${failed}\x1b[0m` : failed))
	console.log(bar)
}
