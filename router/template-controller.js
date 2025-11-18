
// this needs to extend emitter and fire events for route changes
export class TemplateController {
	#route
	#node

	constructor(route, node) {
		this.#route = route
		this.#node = node
	}

	load() {
		this.#loadTemplate()
	}

	// this would be better if it *did* use templates
	// the pros are the page would render without JS
	// any tag could be used not just main (though this could use a *)
	// the cons are links within the template would need to be updated to have the
	// onclick handler as well
	// would either need to store the initial route somewhere or 
	#loadTemplate() {
		const template = document.querySelector(`template[data-q-route="${ this.#route }"`)
		const clone = template.content.cloneNode(true)

		while(this.#node.firstChild) {
			this.#node.removeChild(this.#node.lastChild)
		}

		this.#node.appendChild(clone)
	}
}
