
export const template = (context) => {
	const template = document.getElementById(context.property)
	const clone = template.content.cloneNode(true)

	context.node.appendChild(clone)

	return false
}
