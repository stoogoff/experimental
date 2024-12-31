
export function booleanDirective(type, updateNode) {
	return (node, property, scope) => {
		const invert = property.startsWith('!')

		property = property.replace(/^!/, '')

		let initialValue = scope.data[property]

		initialValue = invert ? !initialValue : initialValue

		updateNode(node, initialValue, initialValue)

		scope.on(`change:${property}`, (key, value, old) => {
			updateNode(node, invert ? !value : value, initialValue)
		})
	}
}

export const disabled = booleanDirective('disabled', (node, bool) => {
	if(bool) {
		node.setAttribute('disabled', 'disabled')
	}
	else {
		node.removeAttribute('disabled')	
	}
})

export const _if = booleanDirective('if', (node, bool) => {
	node.style.display = bool ? '' : 'none'
})
