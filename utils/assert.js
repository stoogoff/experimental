// generic asserts

export const notNull = value => value !== undefined && value !== null

export const isNull = value => value === undefined || value  === null

export const throwIfNull = (value, name, message) => {
	if(isNull(value))
		throw new Error(message || `Null or undefined value found for '${name}'`)
}

export const notIn = (property, obj) => !(property in obj)

export const isIn = (property, obj) => property in obj

export const notEmptyString = value => notNull(value) && value !== ''

export const isEmptyString = value => isNull(value) || value === ''

export const isEmptyArray = value => isNull(value) || Array.isArray(value) && value.length === 0

export const notEmptyArray = value => notNull(value) && Array.isArray(value) && value.length !== 0
