
export const sortByProperty = prop =>
	(a, b) => {
		a = a[prop]
		b = b[prop]

		return a == b ? 0 : (a < b ? -1 : 1)
	}

export const sortByProperties = (prop1, prop2) => {
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

export const unique = (arr) =>
	arr.filter((a, i) => arr.indexOf(a) == i)

// reducers
export const max = (a, c) => Math.max(a, c)
export const min = (a, c) => Math.min(a, c)
export const sum = (a, c) => a + c
export const subtract = (a, c) => a - c
