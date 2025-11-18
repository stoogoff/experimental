
export function attributeDirective(attr) {
	return (context) => {
		context.node.setAttribute(attr, context.value)

		context.scope.on(`change:${context.property}`, (key, value, old) => {
			context.node.setAttribute(attr, value)
		})

		return false
	}
}

export const href = attributeDirective('href')
export const src = attributeDirective('src')
export const _class = attributeDirective('class')
