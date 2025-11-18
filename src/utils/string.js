
export const id = (input) =>
	input.trim().normalize('NFD').replace(/[^a-z0-9\-\s]/gi, '').replace(/\s{1,}/g, "-").toLowerCase()

export const createId = (length = 6) => {
	let output = []
	const characters = '0123456789abcdefghijklmnopqrstuvwxyz'

	for(let i = 0; i < length; ++i) {
		output.push(characters[Math.floor(characters.length * Math.random())])
	}

	return output.join('')
}

export const toTitleCase = text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()

export const slugify = text => text
	.toLowerCase()
	.trim()
	.replace(/^\W+/, '')
	.replace(/\s+/g, '-')

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
