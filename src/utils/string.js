
import { isNumber, isString } from './assert.js'

/**
 * Create a new randomly generate alphanumeric string of the given length.
 * @param {number} length - The length of the string to generate. Defaults to 6.
 * @return {string} The created string.
 */
export const createId = (length = 6) => {
	let output = []
	const characters = '0123456789abcdefghijklmnopqrstuvwxyz'

	for(let i = 0; i < length; ++i) {
		output.push(characters[Math.floor(characters.length * Math.random())])
	}

	return output.join('')
}

/**
 * Converts a string to lower case with a first letter upper case and
 * returns it. Returns an empty string if the provided text is not a string.
 * @param {string} text - The string to convert.
 * @return {string} The converted string or an empty string.
 */
export const toTitleCase = text =>
	isString(text) ? text.charAt(0).toUpperCase() + text.substring(1).toLowerCase() : ''

/**
 * Converts a string to a URL slug and returns it. This converts the text to
 * lower case and trims any leading or trailing whitespace. It then removes any
 * non-alphanumeric characters and replaces multiple spaces with a hyphen.
 * @example
 * slugify('Hello  world! 24')
 * // returns "hello-world-24"
 * @param {string} text - The string to convert.
 * @returnn {string} The converted string.
 */
export const slugify = text => 
	isString(text) || isNumber(text) ?
		text.toString()
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9\s]+/, '')
			.replace(/\s+/g, '-')
	: ''

export const normalise = text => 
	text.toString()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()

export const search = (input, text) => normalise(input).indexOf(normalise(text)) !== -1

export const searchObject = (input, text) => Object.values(input).some(value => search(value, text))

export const isVagueUrl = input => hasProtocol(input) || input.match(/\.[^.]+$/)

export const hasProtocol = input =>
	input.startsWith('http://') || input.startsWith('https://') 
