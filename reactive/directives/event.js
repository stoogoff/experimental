
import { isFunction } from '../../utils/assert.js'
import { logger } from '../config.js'

export function eventHandlerDirective(name) {
	return (node, property, scope) => {
		if(!isFunction(scope[property])) logger().error(`${ name } (directive): ${ property } is not callable`, scope)

		node['on' + name] = evt => {
			if(isFunction(scope[property])) scope[property](evt, scope)
		}

		return false
	}
}

export const click = eventHandlerDirective('click')
export const blur = eventHandlerDirective('blur')
