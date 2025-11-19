import { describe, test, assert } from '../tests.js'
import { slugify, toTitleCase } from '../../src/utils/string.js'

describe('string: slugify', () => {
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
})

describe('string: toTitleCase', () => {
	test('converts lower case to title case', () => {
		const output = toTitleCase('hello world')

		assert(output).isEqual('Hello world')
	})

	test('converts upper case to title case', () => {
		const output = toTitleCase('HELLO WORLD')

		assert(output).isEqual('Hello world')
	})
})