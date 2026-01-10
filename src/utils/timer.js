
import { isNull } from './assert.js'

export const throttle = (callback, time = 250) => {
	let timer = null

	return value => {
		if(isNull(timer)) {
			window.clearTimeout(timer)
		}

		timer = window.setTimeout(() => {
			callback(value)
		}, time)
	}
}
