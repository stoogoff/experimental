
export const value = (node, property, scope) => {
	node.innerText = scope.data[property]

	scope.on(`change:${property}`, (key, value, old) => {
		node.innerText = value
	})
}
