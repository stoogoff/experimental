
export const template = (node, property, scope) => {
	const template = document.getElementById(property)
	const clone = template.content.cloneNode(true)

	node.appendChild(clone)

	return false
}
