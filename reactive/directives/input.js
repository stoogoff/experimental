
export const input = (node, property, scope) => {
	const currentValue = scope.data[property]
	const checkbox = node.type === 'checkbox'

	if(checkbox) {
		node.checked = currentValue
	}
	else {
		node.value = currentValue
	}

	node.onchange = (evt) => {
		scope.data[property] = checkbox ? evt.target.checked : evt.target.value
	}

	scope.on(`change:${property}`, (key, value, old) => {
		node.value = value
	})
}
