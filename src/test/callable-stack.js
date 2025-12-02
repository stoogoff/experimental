
export class CallableStack {
	#stack = []

	add(item) {
		this.#stack.push(item)
	}

	call() {
		this.#stack.forEach(item => item())
	}
}
