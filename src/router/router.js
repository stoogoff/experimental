
// needs a cache of controllers so it doesn't recreate them all the time
// needs to keep the current controller available so it can unload it

export class Router {
	#routes = new Map()
	#node

	constructor(node) {
		this.#node = node

		window.addEventListener('popstate', this)
	}

	handleEvent() {
		this.loadRoute(location.pathname)
	}

	loadRoute(href) {
		const controller = this.#routes.get(href)
		const instance = new controller(href, this.#node)

		instance.load()

		// will need to rerun directives on the loaded template
		this.#prepareLinks()
	}

	register(route, handler) {
		this.#routes.set(route, handler)
	}

	#prepareLinks() {
		const links = Array.from(document.getElementsByTagName('a'))

		links.forEach(link => {
			const href =  link.getAttribute('href')

			if(this.#routes.has(href)) {
				link.addEventListener('click', (evt) => {
					// only change the page if the link goes to a different page
					if(href !== location.pathname) {
						this.loadRoute(href)

						history.pushState(null, null, href)
					}

					evt.preventDefault()
				})
			}
		})
	}

	#createBaseTemplate() {
		const template = document.createElement('template')

		template.setAttribute('data-q-route', this.#node.getAttribute('data-q-route'))
		template.innerHTML = this.#node.innerHTML

		document.body.appendChild(template)
	}

	initialise() {
		this.#prepareLinks()
		this.#createBaseTemplate()
	}

	clear() {
		window.removeEventListener('popstate', this)
	}
}
