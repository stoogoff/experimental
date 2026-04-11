
export default {
	data: {
		count: 0,
	},

	computed: {
		cssClass() {
			if(this.data.count === 0) return 'blue'

			return this.data.count > 0 ? 'green' : 'red' 
		}
	},

	increment() {
		this.data.count++
	},

	decrement() {
		this.data.count--
	},
}
