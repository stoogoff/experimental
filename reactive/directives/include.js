
import { logger } from '../config.js'

const load = async url => {
	logger().log(`include (directive): loading url`, url)

	const response = await fetch(url)

	if(response.status >= 400) {
		const error = new Error()

		error.name = `Error loading '${ url }'`
		error.message = `(${ response.status }) ${ response.statusText }`

		throw error
	}

	return await response.text()
}

export const include = (node, property, scope) => {
	load(scope.data[property]).then(html => node.innerHTML = html)

	scope.on(`change:${property}`, async (key, value, old) => {
		try {
			node.innerHTML = await load(value)
		}
		catch(error) {
			logger().error(error)
		}
	})

	return false
}
