import { throwIfNull } from "./assert.js"

/**
 * Return a sorting function which will sort an array of objects
 * by the provided property.
 * @example
 * const people = [{name: 'Cedric'}, {name: 'Brenda'}, {name: 'Adam'}]
 * const sorted = people.sort(sortByPropery('name'))
 * // sorted === [{name: 'Adam'}, {name: 'Brenda'}, {name: 'Cedric'}]
 * @param {string} prop - The property to use to sort the array.
 * @return {function} The sorting function.
 */
export const sortByProperty = prop => {
	throwIfNull(prop, 'prop')

	return (a, b) => {
		a = a[prop]
		b = b[prop]

		return a == b ? 0 : (a < b ? -1 : 1)
	}
}

/**
 * Sorts an array of objects by the first property then the second.
 * @param {string} prop1
 * @param {string} prop1
 * @return {function}
 */
export const sortByProperties = (prop1, prop2) => {
	throwIfNull(prop1, 'prop1')
	throwIfNull(prop2, 'prop2')

	const sort1 = sortByProperty(prop1)
	const sort2 = sortByProperty(prop2)

	return (a, b) => sort1(a, b) || sort2(a, b)
}

export const findByProperty = (property, value) =>
	(item) => property in item && item[property] == value

export const indexOfByProperty = (list, property, value) => {
	for(let i = 0; i < list.length; ++i) {
		let item = list[i]

		if(property in item && item[property] == value) {
			return i
		}
	}

	return -1
}

export const map = (arr, key, value) => {
	arr = arr || []

	const output = {}

	arr.forEach(item => output[item[key]] = value ? item[value] : item)

	return output
}

/**
 * Returns an array with any duplicate values removed.
 * @params {Array} arr - The array to deduplicate.
 * @return {Array} A new array containing only unique values.
 */
export const unique = (arr) => {
	throwIfNull(arr, 'arr')

	return arr.filter((a, i) => arr.indexOf(a) === i)
}

// reducers
export const max = (a, c) => Math.max(a, c)
export const min = (a, c) => Math.min(a, c)
export const sum = (a, c) => a + c
export const subtract = (a, c) => a - c
