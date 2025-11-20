import { describe, assert } from '../tests.js'
import { isoDate } from '../../src/utils/date.js'

describe('utils/date: isoDate', test => {
	test('converts the date to ISO date format without milliseconds', () => {
		const input = new Date(1975, 1, 9, 19, 38, 12, 345)
		const output = isoDate(input)

		assert(output).isEqual('1975-02-09T19:38:12Z')
	})

	test('converts the current date if no date is specified', () => {
		const now = new Date()
		const output = isoDate()

		assert(output).notNull()
	})
})
