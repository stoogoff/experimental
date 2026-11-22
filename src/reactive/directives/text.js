
export const text = (context) => {
	context.node.innerText = context.value

	context.on(() => {
		context.node.innerText = context.value
	})

	return false
}
