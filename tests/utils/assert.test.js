
import { describe, assert } from '../../src/test/index.js'
import { 
	notNull,
	isNull,
	throwIfNull,
	notIn,
	isIn,
	notEmptyString,
	isEmptyString,
	isEmptyArray,
	isString,
	notString,
	isNumber,
	notNumber,
	notEmptyArray,
	isFunction,
	notFunction,
} from '../../src/utils/assert.js'

describe('utils/assert: notNull', test => {
	test('object', () => {
		const output = notNull({})

		assert(output).isTrue()
	})

	test('array', () => {
		const output = notNull([])

		assert(output).isTrue()
	})

	test('string', () => {
		const output = notNull('hello')

		assert(output).isTrue()
	})

	test('empty string', () => {
		const output = notNull('')

		assert(output).isTrue()
	})

	test('positive number', () => {
		const output = notNull(7)

		assert(output).isTrue()
	})

	test('negative number', () => {
		const output = notNull(-23)

		assert(output).isTrue()
	})

	test('zero', () => {
		const output = notNull(0)

		assert(output).isTrue()
	})

	test('true', () => {
		const output = notNull(true)

		assert(output).isTrue()
	})

	test('false', () => {
		const output = notNull(false)

		assert(output).isTrue()
	})

	test('function', () => {
		const output = notNull(function() {})

		assert(output).isTrue()
	})

	test('null', () => {
		const output = notNull(null)

		assert(output).isFalse()
	})

	test('undefined', () => {
		const output = notNull(undefined)

		assert(output).isFalse()
	})
})

describe('utils/assert: isNull', test => {
	test('object', () => {
		const output = isNull({})

		assert(output).isFalse()
	})

	test('array', () => {
		const output = isNull([])

		assert(output).isFalse()
	})

	test('string', () => {
		const output = isNull('hello')

		assert(output).isFalse()
	})

	test('empty string', () => {
		const output = isNull('')

		assert(output).isFalse()
	})

	test('positive number', () => {
		const output = isNull(7)

		assert(output).isFalse()
	})

	test('negative number', () => {
		const output = isNull(-23)

		assert(output).isFalse()
	})

	test('zero', () => {
		const output = isNull(0)

		assert(output).isFalse()
	})

	test('true', () => {
		const output = isNull(true)

		assert(output).isFalse()
	})

	test('false', () => {
		const output = isNull(false)

		assert(output).isFalse()
	})

	test('function', () => {
		const output = isNull(function() {})

		assert(output).isFalse()
	})

	test('null', () => {
		const output = isNull(null)

		assert(output).isTrue()
	})

	test('undefined', () => {
		const output = isNull(undefined)

		assert(output).isTrue()
	})
})

describe('utils/assert: throwIfNull', test => {
	test('throws for a null value', () => {
		assert(() => throwIfNull(null)).throwsError()
	})

	test("doesn't throw for a value", () => {
		throwIfNull(6)
		test.pass()
	})
})

describe('utils/assert: isIn', test => {
	test('object contains property', () => {
		const input = { name: 'Stoo' }
		const output = isIn('name', input)

		assert(output).isTrue()
	})

	test("object doesn't contains property", () => {
		const input = { name: 'Stoo' }
		const output = isIn('age', input)

		assert(output).isFalse()
	})
})

describe('utils/assert: notIn', test => {
	test('object contains property', () => {
		const input = { name: 'Stoo' }
		const output = notIn('name', input)

		assert(output).isFalse()
	})

	test("object doesn't contains property", () => {
		const input = { name: 'Stoo' }
		const output = notIn('age', input)

		assert(output).isTrue()
	})
})

describe('utils/assert: notEmptyString', test => {
	test('string has content', () => {
		const output = notEmptyString('hello world')

		assert(output).isTrue()
	})

	test('string is empty', () => {
		const output = notEmptyString('')

		assert(output).isFalse()
	})

	test('value is null', () => {
		const output = notEmptyString(null)

		assert(output).isFalse()
	})

	test('value is boolean', () => {
		const output = notEmptyString(false)

		assert(output).isTrue()
	})

	test('value is array', () => {
		const output = notEmptyString([])

		assert(output).isTrue()
	})

	test('value is number', () => {
		const output = notEmptyString(6)

		assert(output).isTrue()
	})
})

describe('utils/assert: isEmptyString', test => {
	test('string has content', () => {
		const output = isEmptyString('hello world')

		assert(output).isFalse()
	})

	test('string is empty', () => {
		const output = isEmptyString('')

		assert(output).isTrue()
	})

	test('value is null', () => {
		const output = isEmptyString(null)

		assert(output).isTrue()
	})

	test('value is boolean', () => {
		const output = isEmptyString(false)

		assert(output).isFalse()
	})

	test('value is array', () => {
		const output = isEmptyString([])

		assert(output).isFalse()
	})

	test('value is number', () => {
		const output = isEmptyString(6)

		assert(output).isFalse()
	})
})

describe('utils/assert: isString', test => {
	test('non-empty string', () => {
		const output = isString('hello world')

		assert(output).isTrue()
	})

	test('empty string', () => {
		const output = isString('')

		assert(output).isTrue()
	})

	test('value is null', () => {
		const output = isString(null)

		assert(output).isFalse()
	})

	test('value is boolean', () => {
		const output = isString(false)

		assert(output).isFalse()
	})

	test('value is array', () => {
		const output = isString([])

		assert(output).isFalse()
	})

	test('value is number', () => {
		const output = isString(6)

		assert(output).isFalse()
	})
})

describe('utils/assert: notString', test => {
	test('non-empty string', () => {
		const output = notString('hello world')

		assert(output).isFalse()
	})

	test('empty string', () => {
		const output = notString('')

		assert(output).isFalse()
	})

	test('value is null', () => {
		const output = notString(null)

		assert(output).isTrue()
	})

	test('value is boolean', () => {
		const output = notString(false)

		assert(output).isTrue()
	})

	test('value is array', () => {
		const output = notString([])

		assert(output).isTrue()
	})

	test('value is number', () => {
		const output = notString(6)

		assert(output).isTrue()
	})
})

describe('utils/assert: isNumber', test => {
	test('an integer', () => {
		const output = isNumber(36)

		assert(output).isTrue()
	})

	test('a negative integer', () => {
		const output = isNumber(-64)

		assert(output).isTrue()
	})

	test('a float', () => {
		const output = isNumber(6.45)

		assert(output).isTrue()
	})

	test('a negative float', () => {
		const output = isNumber(-54.6)

		assert(output).isTrue()
	})

	test('array with values', () => {
		const output = isNumber([4, 5, 6])

		assert(output).isFalse()
	})

	test('value is null', () => {
		const output = isNumber(null)

		assert(output).isFalse()
	})

	test('value is boolean', () => {
		const output = isNumber(true)

		assert(output).isFalse()
	})

	test('value is non-numeric string', () => {
		const output = isNumber('hello world')

		assert(output).isFalse()
	})

	test('value is an integer as a string', () => {
		const output = isNumber('302')

		assert(output).isFalse()
	})

	test('value is a float as a string', () => {
		const output = isNumber('14.64')

		assert(output).isFalse()
	})

	test('value is object', () => {
		const output = isNumber({ prop: 'Test' })

		assert(output).isFalse()
	})

	test('value is function', () => {
		const output = isNumber(function() {})

		assert(output).isFalse()
	})
})

describe('utils/assert: notNumber', test => {
	test('an integer', () => {
		const output = notNumber(36)

		assert(output).isFalse()
	})

	test('a negative integer', () => {
		const output = notNumber(-64)

		assert(output).isFalse()
	})

	test('a float', () => {
		const output = notNumber(6.45)

		assert(output).isFalse()
	})

	test('a negative float', () => {
		const output = notNumber(-54.6)

		assert(output).isFalse()
	})

	test('array with values', () => {
		const output = notNumber([4, 5, 6])

		assert(output).isTrue()
	})

	test('value is null', () => {
		const output = notNumber(null)

		assert(output).isTrue()
	})

	test('value is boolean', () => {
		const output = notNumber(true)

		assert(output).isTrue()
	})

	test('value is non-numeric string', () => {
		const output = notNumber('hello world')

		assert(output).isTrue()
	})

	test('value is an integer as a string', () => {
		const output = notNumber('302')

		assert(output).isTrue()
	})

	test('value is a float as a string', () => {
		const output = notNumber('14.64')

		assert(output).isTrue()
	})

	test('value is object', () => {
		const output = notNumber({ prop: 'Test' })

		assert(output).isTrue()
	})

	test('value is function', () => {
		const output = notNumber(function() {})

		assert(output).isTrue()
	})
})

describe('utils/assert: isEmptyArray', test => {
	test('empty array', () => {
		const output = isEmptyArray([])

		assert(output).isTrue()
	})

	test('array with values', () => {
		const output = isEmptyArray([4, 5, 6])

		assert(output).isFalse()
	})

	test('value is null', () => {
		const output = isEmptyArray(null)

		assert(output).isTrue()
	})

	test('value is boolean', () => {
		const output = isEmptyArray(true)

		assert(output).isFalse()
	})

	test('value is string', () => {
		const output = isEmptyArray('hello world')

		assert(output).isFalse()
	})

	test('value is number', () => {
		const output = isEmptyArray(6)

		assert(output).isFalse()
	})

	test('value is function', () => {
		const output = isEmptyArray(function() {})

		assert(output).isFalse()
	})
})

describe('utils/assert: notEmptyArray', test => {
	test('empty array', () => {
		const output = notEmptyArray([])

		assert(output).isFalse()
	})

	test('array with values', () => {
		const output = notEmptyArray([4, 5, 6])

		assert(output).isTrue()
	})

	test('value is null', () => {
		const output = notEmptyArray(null)

		assert(output).isFalse()
	})

	test('value is boolean', () => {
		const output = notEmptyArray(true)

		assert(output).isFalse()
	})

	test('value is string', () => {
		const output = notEmptyArray('hello world')

		assert(output).isFalse()
	})

	test('value is number', () => {
		const output = notEmptyArray(6)

		assert(output).isFalse()
	})

	test('value is function', () => {
		const output = notEmptyArray(function() {})

		assert(output).isFalse()
	})
})

describe('utils/assert: isFunction', test => {
	test('with a function', () => {
		const output = isFunction(function() {})

		assert(output).isTrue()
	})

	test('value is array', () => {
		const output = isFunction([4, 5, 6])

		assert(output).isFalse()
	})

	test('value is null', () => {
		const output = isFunction(null)

		assert(output).isFalse()
	})

	test('value is boolean', () => {
		const output = isFunction(true)

		assert(output).isFalse()
	})

	test('value is string', () => {
		const output = isFunction('hello world')

		assert(output).isFalse()
	})

	test('value is number', () => {
		const output = isFunction(6)

		assert(output).isFalse()
	})
})

describe('utils/assert: notFunction', test => {
	test('with a function', () => {
		const output = notFunction(function() {})

		assert(output).isFalse()
	})

	test('value is array', () => {
		const output = notFunction([4, 5, 6])

		assert(output).isTrue()
	})

	test('value is null', () => {
		const output = notFunction(null)

		assert(output).isTrue()
	})

	test('value is boolean', () => {
		const output = notFunction(true)

		assert(output).isTrue()
	})

	test('value is string', () => {
		const output = notFunction('hello world')

		assert(output).isTrue()
	})

	test('value is number', () => {
		const output = notFunction(6)

		assert(output).isTrue()
	})
})
