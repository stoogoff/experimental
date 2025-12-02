
export class Failure {
	#description

	constructor(description, error, time) {
		this.#description = `  ✘ ${description}\n  ${error} (${time}ms)`
	}

	toString() {
		return this.#description
	}
}
