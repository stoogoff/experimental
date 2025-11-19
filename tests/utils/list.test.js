import { describe, test, assert } from '../tests.js'
import { sortByProperty, unique, max, min, sum, subtract } from '../../src/utils/list.js'

describe('list: sortByProperty', () => {
	test('returns a function for a property', () => {
		const output = sortByProperty('name')

		assert(output).isFunction()
	})

	test('sorts data by property', () => {
		const input = [
			{ name: 'gamma' },
			{ name: 'beta' },
			{ name: 'alpha' },
		]
		const output = input.sort(sortByProperty('name'))

		assert(output).notNull()
		assert(output.length).isEqual(3)
		assert(output[0].name).isEqual('alpha')
		assert(output[1].name).isEqual('beta')
		assert(output[2].name).isEqual('gamma')
	})

	test('throws an error if no property is set', () => {
		try {
			sortByProperty()
		}
		catch(error) {
			assert(error).isError()
		}
	})

	test("doesn't sort if the property doesn't exist", () => {
		const input = [
			{ name: 'gamma' },
			{ name: 'beta' },
			{ name: 'alpha' },
		]
		const output = input.sort(sortByProperty('sort'))

		assert(output).isArray()
		assert(output.length).isEqual(3)
		assert(output[0].name).isEqual('gamma')
		assert(output[1].name).isEqual('beta')
		assert(output[2].name).isEqual('alpha')
	})
})

describe('list: unique', () => {
	test('removes duplicated string values', () => {
		const input = ['aa', 'bb', 'aa', 'cc']
		const output = unique(input)

		assert(output).isArray()
		assert(output.length).isEqual(3)
		assert(output[0]).isEqual('aa')
		assert(output[1]).isEqual('bb')
		assert(output[2]).isEqual('cc')
	})

	test('removes duplicated numeric values', () => {
		const input = [1, 2, 1, 3]
		const output = unique(input)

		assert(output).isArray()
		assert(output.length).isEqual(3)
		assert(output[0]).isEqual(1)
		assert(output[1]).isEqual(2)
		assert(output[2]).isEqual(3)
	})

	test('throws an error if no input provided', () => {
		try {
			unique()
		}
		catch(error) {
			assert(error).isError()
		}
	})
})

describe('list: reducers', () => {
	test('sums two numbers', () => {
		const output = sum(1, 2)

		assert(output).isEqual(3)
	})

	test('substracts two numbers', () => {
		const output = subtract(2, 1)

		assert(output).isEqual(1)
	})

	test('picks the highest value', () => {
		const output = max(2, 1)

		assert(output).isEqual(2)
	})

	test('picks the lowest value', () => {
		const output = min(2, 1)

		assert(output).isEqual(1)
	})

	test('sums the numbers of an array', () => {
		const input = [1, 2, 3, 4]
		const output = input.reduce(sum, 0)

		assert(output).isEqual(10)
	})

	test('substracts the numbers of an array', () => {
		const input = [10, 5, 3, 1]
		const output = input.reduce(subtract, 20)

		assert(output).isEqual(1)
	})

	test('picks the highest value of an array', () => {
		const input = [1, 2, 3, 4]
		const output = input.reduce(max, 0)

		assert(output).isEqual(4)
	})

	test('picks the lowest value of an array', () => {
		const input = [1, 2, 3, 4]
		const output = input.reduce(min, 1000)

		assert(output).isEqual(1)
	})
})
