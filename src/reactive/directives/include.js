
import { logger } from '../config.js'

const cache = new Map()

const load = async url => {
	logger().log(`include (directive): loading url`, url)

	if(cache.has(url)) return cache.get(url)

	const response = await fetch(url)

	if(response.status >= 400) {
		const error = new Error()

		error.name = `Error loading '${ url }'`
		error.message = `(${ response.status }) ${ response.statusText }`

		throw error
	}

	cache.set(url, response.text())

	return await cache.get(url)
}

export const include = (context) => {
	load(context.value).then(html => context.node.innerHTML = html)

	context.scope.on(`change:${context.property}`, async (key, value, old) => {
		try {
			node.innerHTML = await load(value)
		}
		catch(error) {
			logger().error(error)
		}
	})

	return false
}

export const url = (context) => {
	load(context.property).then(html => context.node.innerHTML = html)

	return false
}
