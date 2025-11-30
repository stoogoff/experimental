
/**
 * Returns true if the given value is not null or undefined.
 * @param {*} value - The value to verify.
 * @return {boolean}
 */
export const notNull = value => value !== undefined && value !== null

/**
 * Returns true if the given value is null or undefined.
 * @param {*} value - The value to verify.
 * @return {boolean}
 */
export const isNull = value => value === undefined || value  === null

/**
 * Throws an error if the provided value is null.
 * @example
 * const x = null
 * throwIfNull(x, 'x')
 * // throws an error with the message "Null or undefined value found for 'x'"
 * @example
 * const x = null
 * throwIfNull(x, "Value not given")
 * // throws an error with the message "Value not given"
 * @param {*} value -
 * @param {string} name - the name of the variable.
 * @param {string} message - an optional message for the error.
 */
export const throwIfNull = (value, name, message) => {
	if(isNull(value))
		throw new Error(message || `Null or undefined value found for '${name}'`)
}

/**
 * Returns true if the given property doesn't exist in the object.
 * @param {string} property - The property to check for.
 * @param {Object} obj - The object the property might be in.
 * @return {boolean}
 */
export const notIn = (property, obj) => !(property in obj)

/**
 * Returns true if the given property exists in the object.
 * @param {string} property - The property to check for.
 * @param {Object} obj - The object the property might be in.
 * @return {boolean}
 */
export const isIn = (property, obj) => property in obj

/**
 * Returns true if the given value is not null and an empty string.
 * @param {*} value - The value to verify.
 * @return {boolean}
 */
export const notEmptyString = value => notNull(value) && value !== ''

/**
 * Returns true if the given value is null or an empty string.
 * @param {*} value - The value to verify.
 * @return {boolean}
 */
export const isEmptyString = value => isNull(value) || value === ''

/**
 * Returns true if the given value is not null and is a string.
 * @param {*} value - The value to verify.
 * @return {boolean}
 */
export const isString = value => notNull(value) && typeof value === 'string'

/**
 * Returns true if the given value is null or is not a string.
 * @param {*} value - The value to verify.
 * @return {boolean}
 */
export const notString = value => isNull(value) || typeof value !== 'string'

/**
 * Returns true if the given value is not null and is a number.
 * @param {*} value - The value to verify.
 * @return {boolean}
 */
export const isNumber = value => notNull(value) && typeof value === 'number'

/**
 * Returns true if the given value is null or not a number.
 * @param {*} value - The value to verify.
 * @return {boolean}
 */
export const notNumber = value => isNull(value) || typeof value !== 'number'

/**
 * Returns true if the given value is null or an array of length zero.
 * @param {*} value - The value to verify.
 * @return {boolean}
 */
export const isEmptyArray = value => isNull(value) || Array.isArray(value) && value.length === 0

/**
 * Returns true if the given value is not null and is an array with at least one element.
 * @param {*} value - The value to verify.
 * @return {boolean}
 */
export const notEmptyArray = value => notNull(value) && Array.isArray(value) && value.length !== 0

/**
 * Returns true if the given value is not null and is a function.
 * @param {*} value - The value to verify.
 * @return {boolean}
 */
export const isFunction = value => notNull(value) && typeof value === 'function'

/**
 * Returns false if the given value is null or is a function.
 * @param {*} value - The value to verify.
 * @return {boolean}
 */
export const notFunction = value => isNull(value) || typeof value !== 'function'
