
export const input = (context) => {
	const currentValue = context.value
	const checkbox = context.node.type === 'checkbox'

	if(checkbox) {
		context.node.checked = !!currentValue
	}
	else {
		context.node.value = currentValue
	}

	context.node.addEventListener('change', (evt) => {
		context.value = checkbox ? evt.target.checked : evt.target.value
	})

	context.scope.on(`change:${context.property}`, (key, value, old) => {
		if(checkbox) {
			context.node.checked = value === true
		}
		else {
			context.node.value = value
		}
	})

	return false
}
