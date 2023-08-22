
const directives = (function() {
	const directives = []

	return {
		register(attribute, callback) {
			directives.push({ attribute, callback })
		},

		load(domNodeOrId, scope) {
			const root = domNodeOrId instanceof Node
				? domNodeOrId
				: document.getElementById(domNodeOrId)

			directives.forEach(({ attribute, callback }) => {
				const nodes = root.querySelectorAll(`[data-${attribute}]`)

				Array.from(nodes).forEach(node => callback(node, node.dataset[attribute], scope))
			})
		},
	}
})()

directives.register('value', (node, property, scope) => {
	node.innerText = scope.data[property]

	scope.data.on(`change:${property}`, (key, value, old) => {
		node.innerText = value
	})
})

directives.register('input', (node, property, scope) => {
	const value = scope.data[property]
	const checkbox = node.type === 'checkbox'

	if(checkbox) {
		node.checked = value
	}
	else {
		node.value = value
	}

	node.onchange = (evt) => {
		scope.data[property] = checkbox ? evt.target.checked : evt.target.value
	}

	scope.data.on(`change:${property}`, (key, value, old) => {
		node.value = value
	})
})

directives.register('click', (node, property, scope) => {
	node.onclick = (evt) => {
		scope[property](evt)
	}
})

function disabledEnabled(type) {
	const updateNode = (node, disabled) => {
		if(disabled == (type === 'disabled')) {
			node.setAttribute('disabled', 'disabled')
		}
		else {
			node.removeAttribute('disabled')	
		}
	}

	directives.register(type, (node, property, scope) => {
		const disabled = scope.data[property]

		updateNode(node, disabled)

		scope.data.on(`change:${property}`, (key, value, old) => {
			updateNode(node, value)
		})
	})
}

disabledEnabled('disabled')
disabledEnabled('enabled')


function each() {
	const createNode = (node, parent, value, scope) => {
		const clone = node.cloneNode(true)

		if(clone.childNodes.length === 0) {
			clone.innerText = value
		}
		else {
			const newScope = scope.clone(clone, value)

			clone.setAttribute('data-scope', JSON.stringify(value))
		}

		parent.appendChild(clone)
	}

	directives.register('each', (node, property, scope) => {
		const parent = node.parentNode
		const values = scope.data[property]

		if(!values) return

		// clone nodes
		values.forEach(value => {
			createNode(node, parent, value, scope)
		})

		// remove base node
		node.remove()

		scope.data.on(`change:${property}`, (key, values, old) => {
			// remove existing nodes
			// TODO remove only nodes we're aware of, not everything
			while(parent.firstChild) {
				parent.removeChild(parent.lastChild)
			}

			// clone nodes
			values.forEach(value => {
				createNode(node, parent, value, scope)
			})
		})
	})
}

each()


class Component {
	constructor(domNodeOrId, component = {}) {
		this.onload = () => {}
		this.data = new Observable(component.data || {})

		if(component.watch) {
			Object.keys(component.watch).forEach(watcher => {
				this.data.on(`change:${watcher}`, (key, value, old) => {
					component.watch[watcher].call(this, value, old)
				})
			})
		}

		Object.keys(component).forEach(key => {
			if(key === 'data' || key === 'watch') {
				return
			}

			this[key] = component[key]
		})

		this.onload()
		directives.load(domNodeOrId, this)
	}

	clone(node, data) {
		const newScope = {
			data: new Observable(data),
		}

		Object.keys(this).forEach(key => {
			if(key === 'data' || key === 'watch') {
				return
			}

			newScope[key] = this[key].bind(this)
		})

		directives.load(node, newScope)

		return newScope
	}
}
