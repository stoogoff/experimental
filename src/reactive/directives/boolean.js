
export function booleanDirective(type, updateNode) {
	return (context) => {
		const invert = context.property.startsWith('!')
		const property = context.property.replace(/^!/, '')

		const initialValue = context.value

		updateNode(context.node, invert ? !initialValue : initialValue)

		context.scope.on(`change:${context.property}`, (key, value, old) => {
			updateNode(context.node, invert ? !value : value)
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
