
export default {
	data: {
		count: 0,
	},

	created() {
		console.log(`created: ${this.data.count}`)
	},

	mounted() {
		console.log(`mounted: ${this.data.count}`)
	},

	increment() {
		this.data.count++
	},

	decrement() {
		this.data.count--
	},
}
