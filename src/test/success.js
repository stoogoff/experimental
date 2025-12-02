
export class Success {
	#description

	constructor(description, time) {
		this.#description = `  ✔ ${description} (${time}ms)`
	}

	toString() {
		return this.#description
	}
}
