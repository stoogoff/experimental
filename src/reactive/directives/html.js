
export const html = context => {
	context.node.innerHTML = context.value

	context.scope.on(`change:${context.property}`, (key, value, old) => {
		context.node.innerHTML = value
	})

	return false
}
