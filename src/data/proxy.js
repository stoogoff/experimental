
import { ProxiedModel } from './model.js'

const proxied = new Map()

export const getProxy = (model, key = 'id') => {
	if(proxied.has(model[key])) return proxied.get(model[key])

	const proxiedModel = new ProxiedModel(model)

	proxied.set(model[key], proxiedModel)

	return proxiedModel
}
