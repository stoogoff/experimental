
import { isFunction } from '../../utils/assert.js'
import { logger } from '../config.js'

export const click = (node, property, scope) => {
	if(!isFunction(scope[property])) logger().error(`click (directive): ${ property } is not callable`, scope)

	node.onclick = evt => {
		if(isFunction(scope[property])) scope[property](evt, scope)
	}

	return false
}
