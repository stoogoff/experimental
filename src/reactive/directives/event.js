
export function eventHandlerDirective(name) {
	return (context) => {
		context.node.addEventListener(name, context)

		return false
	}
}

export const blur = eventHandlerDirective('blur')
export const change = eventHandlerDirective('change')
export const click = eventHandlerDirective('click')
export const dragenter = eventHandlerDirective('dragenter')
export const dragleave = eventHandlerDirective('dragleave')
export const dragover = eventHandlerDirective('dragover')
export const drop = eventHandlerDirective('drop')
export const focus = eventHandlerDirective('focus')
export const keydown = eventHandlerDirective('keydown')
export const keyup = eventHandlerDirective('keyup')
export const mousedown = eventHandlerDirective('mousedown')
export const mousemove = eventHandlerDirective('mousemove')
export const mouseout = eventHandlerDirective('mouseout')
export const mouseover = eventHandlerDirective('mouseover')
export const mouseup = eventHandlerDirective('mouseup')
export const search = eventHandlerDirective('search')
