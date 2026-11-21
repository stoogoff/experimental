
import { logger } from '../config.js'

const cache = new Map()

const load = path => {
	if(cache.has(path)) return cache.get(path)

	const promise = fetch(path).then(response => {
		if(!response.ok) {
			cache.delete(path)
			throw new Error(`Failed to load ${path}: ${response.status}`)
		}
		return response.text()
	}).catch(err => {
		cache.delete(path)
		throw err
	})

	cache.set(path, promise)
	return promise
}

export const include = (context) => {
	let latestToken = 0

	const render = async (value) => {
		const token = ++latestToken

		try {
			const html = await load(value)

			if(token === latestToken) {
				context.node.innerHTML = html
			}
		}
		catch(error) {
			logger().error(error)
		}
	}

	render(context.value)

	context.scope.on(`change:${context.property}`, (_key, value, _old) => {
		render(value)
	})

	return false
}

export const url = (context) => {
	load(context.property).then(html => context.node.innerHTML = html).catch(err => logger().error(err))

	return false
}
