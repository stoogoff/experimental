
import { ProxiedModel } from './model.js'
import { throwIfNull } from '../utils/assert.js'

const proxied = new Map()

export const getProxy = (model, key = 'id') => {
	throwIfNull(model, 'model')

	if(proxied.has(model[key])) return proxied.get(model[key])

	const proxiedModel = new ProxiedModel(model)

	proxied.set(model[key], proxiedModel)

	return proxiedModel
}
