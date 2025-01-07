
export function booleanDirective(type, updateNode) {
	return (node, property, scope) => {
		const invert = property.startsWith('!')

		property = property.replace(/^!/, '')

		const initialValue = scope.data[property]

		updateNode(node, invert ? !initialValue : initialValue)

		scope.on(`change:${property}`, (key, value, old) => {
			updateNode(node, invert ? !value : value)
		})

		return false
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
