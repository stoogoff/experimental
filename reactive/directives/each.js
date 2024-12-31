
const createNode = (node, parent, value, scope, directives) => {
	const clone = node.cloneNode(true)

	clone.removeAttribute('data-each')

	if(clone.childNodes.length === 0) {
		console.log('single node')
		clone.innerText = value
	}
	else {
		const newScope = scope.clone(value)

		directives.loadDirectivesForNode(clone, newScope)
	}

	parent.appendChild(clone)
}

export const each = (node, property, scope, directives) => {
	const parent = node.parentNode
	const values = scope.data[property]
	console.log('each', { values })
	if(!values) return

	// clone nodes
	values.forEach(value => {
		createNode(node, parent, value, scope, directives)
	})

	// remove base node
	node.remove()

	scope.on(`change:${property}`, (key, values, old) => {
		// remove existing nodes
		// TODO remove only nodes we're aware of, not everything
		while(parent.firstChild) {
			parent.removeChild(parent.lastChild)
		}

		// clone nodes
		values.forEach(value => {
			createNode(node, parent, value, scope, directives)
		})
	})
}
