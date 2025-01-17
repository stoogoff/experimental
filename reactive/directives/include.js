
import { logger } from '../config.js'

const load = async url => {
	logger().log(`include (directive): loading url`, url)

	const response = await fetch(url)

	return await response.text()
}

export const include = (node, property, scope) => {
	load(scope.data[property]).then(html => node.innerHTML = html)

	scope.on(`change:${property}`, async (key, value, old) => {
		node.innerHTML = await load(value)
	})

	return false
}
