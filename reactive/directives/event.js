
import { isFunction } from '../../utils/assert.js'
import { logger } from '../config.js'

export function eventHandlerDirective(name) {
	return (context) => {
		if(!isFunction(context.value)) logger().error(`${ name } (directive): ${ context.property } is not callable`)

		context.node['on' + name] = evt => {
			if(isFunction(context.value)) context.value(evt, context)
		}

		return false
	}
}

export const click = eventHandlerDirective('click')
export const blur = eventHandlerDirective('blur')
