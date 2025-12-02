
export const text = (context) => {
	context.node.innerText = context.value

	context.scope.on(`change:${context.property}`, (key, value, old) => {
		context.node.innerText = value
	})

	return false
}
