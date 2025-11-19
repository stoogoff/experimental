import { describe, assert } from '../tests.js'
import { slugify, toTitleCase } from '../../src/utils/string.js'

describe('string: slugify', test => {
	test('convert space to hyphen', () => {
		const output = slugify('hello world')

		assert(output).isEqual('hello-world')
	})

	test('convert multiple spaces to single hyphen', () => {
		const output = slugify('hello  world')

		assert(output).isEqual('hello-world')
	})

	test('convert multiple spaces to single hyphen', () => {
		const output = slugify('hello the world')

		assert(output).isEqual('hello-the-world')
	})

	test('convert UPPERCASE to LOWERCASE', () => {
		const output = slugify('HELLO WORLD')

		assert(output).isEqual('hello-world')
	})

	test('trim start and end whitespace', () => {
		const output = slugify(' hello world ')

		assert(output).isEqual('hello-world')
	})

	test('removes special characters', () => {
		const output = slugify('hello !@£$%^&*()-+_={}[];:"\'?/.,><`~§± world')

		assert(output).isEqual('hello-world')
	})

	test('includes numbers', () => {
		const output = slugify('hello1 world2 34')

		assert(output).isEqual('hello1-world2-34')
	})

	test('returns an empty string if no value is provided', () => {
		const output = slugify()

		assert(output).isEqual('')
	})

	test('returns an empty string if a number is provided', () => {
		const output = slugify(6)

		assert(output).isEqual('6')
	})

	test('returns an empty string if a boolean is provided', () => {
		const output = slugify(true)

		assert(output).isEqual('')
	})

	test('returns an empty string if an array is provided', () => {
		const output = slugify([5, 6])

		assert(output).isEqual('')
	})

	test('returns an empty string if an object is provided', () => {
		const output = slugify({ prop: 'Test' })

		assert(output).isEqual('')
	})
})

describe('string: toTitleCase', test => {
	test('converts lower case to title case', () => {
		const output = toTitleCase('hello world')

		assert(output).isEqual('Hello world')
	})

	test('converts upper case to title case', () => {
		const output = toTitleCase('HELLO WORLD')

		assert(output).isEqual('Hello world')
	})

	test('returns an empty string if no value is provided', () => {
		const output = toTitleCase()

		assert(output).isEqual('')
	})

	test('returns an empty string if a number is provided', () => {
		const output = toTitleCase(6)

		assert(output).isEqual('')
	})

	test('returns an empty string if a boolean is provided', () => {
		const output = toTitleCase(true)

		assert(output).isEqual('')
	})

	test('returns an empty string if an array is provided', () => {
		const output = toTitleCase([5, 6])

		assert(output).isEqual('')
	})

	test('returns an empty string if an object is provided', () => {
		const output = toTitleCase({ prop: 'Test' })

		assert(output).isEqual('')
	})
})
