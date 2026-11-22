
export const html = context => {
	context.node.innerHTML = context.value

	context.on(() => {
		context.node.innerHTML = context.value
	})

	return false
}
