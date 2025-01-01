
export function attributeDirective(attr) {
	return (node, property, scope) => {
		node.setAttribute(attr, scope.data[property])

		scope.on(`change:${property}`, (key, value, old) => {
			node.setAttribute(attr, value)
		})
	}
}

export const href = attributeDirective('href')
export const src = attributeDirective('src')
export const _class = attributeDirective('class')
