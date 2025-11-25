
import { ProxiedModel } from './model.js'
import { throwIfNull } from '../utils/assert.js'

const proxied = new Map()

/**
 * Supply a model a receive a proxied version. If a proxied version
 * already exists, based on its key, then that is returned instead.
 * @param {Object} model - the model
 * @param {string} key - the name of the property to use as a primary key.
 * Defaults to 'id'
 * @return {ProxiedModel} the proxied model instance
 */
export const getProxy = (model, key = 'id') => {
	throwIfNull(model, 'model')

	if(proxied.has(model[key])) return proxied.get(model[key])

	const proxiedModel = new ProxiedModel(model)

	proxied.set(model[key], proxiedModel)

	return proxiedModel
}

/**
 * Return a proxied model by its primary key, if it exists.
 * @param {*} key - the primary key of the model
 * @return {ProxiedModel | null} the model with the matching primary key or null
 */
export const getProxyByKey = key => {
	throwIfNull(key, 'key')

	return proxied.get(key) ?? null
}

/**
 * Delete a proxied model with the given primary key.
 * @param {*} key - the primary key of the model to delete
 * @return {Object | null} the model to be deleted
 */
export const deleteProxy = key => {
	throwIfNull(key, 'key')

	let model = proxied.has(key) ? proxied.get(key) : null

	proxied.delete(key)

	return model
}

/**
 * Remove all proxied models.
 */
export const clearAllProxies = () => proxied.clear()
