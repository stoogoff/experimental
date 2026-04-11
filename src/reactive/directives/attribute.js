
export function attributeDirective(attr) {
	return (context) => {
		context.node.setAttribute(attr, context.value)

		context.scope.on(`change:${context.property}`, (key, value, old) => {
			context.node.setAttribute(attr, value)
		})

		return false
	}
}

export const alt = attributeDirective('alt')
export const href = attributeDirective('href')
export const id = attributeDirective('id')
export const placeholder = attributeDirective('placeholder')
export const src = attributeDirective('src')
export const title = attributeDirective('title')
export const type = attributeDirective('type')
export const _class = attributeDirective('class')
