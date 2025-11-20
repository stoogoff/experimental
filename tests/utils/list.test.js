import { describe, assert } from '../tests.js'
import {
	findByProperty,
	sortByProperty,
	sortByProperties,
	unique,
	max,
	min,
	sum,
	subtract,
} from '../../src/utils/list.js'

describe('utils/list: sortByProperty', test => {
	test('returns a function for a property', () => {
		const output = sortByProperty('name')

		assert(output).isFunction()
	})

	const unsorted = [
		{ 'string': 'aa', number: 1 },
		{ 'string': 'ab', number: 4 },
		{ 'string': 'AA', number: 2 },
		{ 'string': 'Aa', number: 0 },
	]

	test('sorts correctly by string property', () => {
		const sorted = unsorted.sort(sortByProperty('string'))

		assert(sorted[0].string).isEqual('AA')
		assert(sorted[1].string).isEqual('Aa')
		assert(sorted[2].string).isEqual('aa')
		assert(sorted[3].string).isEqual('ab')
	})

	test('sorts correctly by numeric property', () => {
		const sorted = unsorted.sort(sortByProperty('number'))

		assert(sorted[0].number).isEqual(0)
		assert(sorted[1].number).isEqual(1)
		assert(sorted[2].number).isEqual(2)
		assert(sorted[3].number).isEqual(4)
	})

	test('throws an error if no property is set', () => {
		assert(() => sortByProperty()).throwsError()
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

describe('utils/list: sortByProperties', test => {
	const unsorted = [
		{ 'string': 'ac', number: 1 },
		{ 'string': 'ad', number: 0 },
		{ 'string': 'ab', number: 2 },
		{ 'string': 'aa', number: 3 },
		{ 'string': 'ac', number: 5 },
		{ 'string': 'ab', number: 4 },
		{ 'string': 'aa', number: 1 },
	]

	test('returns a function for properties', () => {
		const output = sortByProperty('name', 'age')

		assert(output).isFunction()
	})

	test('sorts correctly by multiple properties: string then number', () => {
		const output = unsorted.sort(sortByProperties('string', 'number'))

		assert(output[0].string).isEqual('aa')
		assert(output[0].number).isEqual(1)
		assert(output[1].string).isEqual('aa')
		assert(output[1].number).isEqual(3)

		assert(output[2].string).isEqual('ab')
		assert(output[2].number).isEqual(2)
		assert(output[3].string).isEqual('ab')
		assert(output[3].number).isEqual(4)
	})

	test('sorts correctly by multiple properties: number then string', () => {
		const output = unsorted.sort(sortByProperties('number', 'string'))

		assert(output[0].string).isEqual('ad')
		assert(output[0].number).isEqual(0)
		assert(output[1].string).isEqual('aa')
		assert(output[1].number).isEqual(1)

		assert(output[2].string).isEqual('ac')
		assert(output[2].number).isEqual(1)
		assert(output[3].string).isEqual('ab')
		assert(output[3].number).isEqual(2)
	})

	test('throws an error if property one is not set', () => {
		assert(() => sortByProperties()).throwsError()
	})

	test('throws an error if property two is not set', () => {
		assert(() => sortByProperties('property')).throwsError()
	})
})

describe('utils/list: findByProperty', test => {
	const data = [
		{ 'string': 'ac', number: 1 },
		{ 'string': 'ad', number: 0 },
		{ 'string': 'ab', number: 2 },
		{ 'string': 'aa', number: 3 },
		{ 'string': 'ac', number: 5 },
		{ 'string': 'ab', number: 4 },
		{ 'string': 'aa', number: 1 },
	]

	test('returns a function for the property', () => {
		const output = findByProperty('string', 'zz')

		assert(output).isFunction()
	})

	test('returns the first object with a matching property', () => {
		const output = data.find(findByProperty('string', 'ab'))

		assert(output).notNull()
		assert(output.string).isEqual('ab')
		assert(output.number).isEqual(2)
	})

	test("returns undefined if a property doesn't match", () => {
		const output = data.find(findByProperty('string', 'zz'))

		assert(output).isNull()
	})

	test("returns undefined if the property doesn't exist", () => {
		const output = data.find(findByProperty('nothing', 'zz'))

		assert(output).isNull()
	})

	test('returns an array of objects when filtered', () => {
		const output = data.filter(findByProperty('string', 'aa'))

		assert(output).notNull()
		assert(output.length).isEqual(2)
		assert(output[0]).isEqual(data[3])
		assert(output[1]).isEqual(data[6])
	})
})

describe('utils/list: indexOfByProperty', test => {
	const data = [
		{ 'string': 'ac' },
		{ 'string': 'ad' },
		{ 'string': 'ab' },
		{ 'string': 'aa' },
		{ 'string': 'ac' },
		{ 'string': 'ab' },
		{ 'string': 'aa' },
	]

	test('returns the first index', () => {
		const output = indexOfByProperty(data, 'string', 'aa')

		assert(output).isEqual(3)
	})

	test('returns -1 if not found', () => {
		const output = indexOfByProperty(data, 'string', 'ZZ')

		assert(output).isEqual(-1)
	})
})

describe('utils/list: unique', test => {
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
		assert(() => unique()).throwsError()
	})
})

describe('utils/list: reducers', test => {
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
