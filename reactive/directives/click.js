
export const click = (node, property, scope) => {
	node.onclick = (evt) => {
		scope[property](scope, evt)
	}

	return false
}
