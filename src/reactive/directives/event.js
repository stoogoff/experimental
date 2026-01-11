
import { isFunction } from '../../utils/assert.js'
import { logger } from '../config.js'

export function eventHandlerDirective(name) {
	return (context) => {
		if(!isFunction(context.value)) {
			logger().error(`${ name } (directive): ${ context.property } is not callable`)
			return
		}

		context.node.addEventListener(name, context)

		return false
	}
}

export const click = eventHandlerDirective('click')
export const blur = eventHandlerDirective('blur')
export const focus = eventHandlerDirective('focus')
export const keyup = eventHandlerDirective('keyup')
export const keydown = eventHandlerDirective('keydown')
export const mouseover = eventHandlerDirective('mouseover')
export const mouseout = eventHandlerDirective('mouseout')
export const mousedown = eventHandlerDirective('mousedown')
export const mouseup = eventHandlerDirective('mouseup')
export const mousemove = eventHandlerDirective('mousemove')
