
class Counter {
	constructor() {
		this.count = 0
	}

	get cssClass() {
		if(this.count === 0) return 'blue'

		return this.count < 0 ? 'red' : 'green'
	}
}


export default {
	//data: new Counter(),
	data: {
		scope: 'counter',
		count: 0,
	},

	computed: {
		cssClass() {
			if(this.data.count === 0) return 'blue'

			return this.data.count < 0 ? 'red' : 'green'
		},
	},

	watch: {
		cssClass() {
			//console.log(this.data.cssClass)
		},
	},

	created() {
		//console.log(`created: ${this.data.count}`)
	},

	mounted() {
		this.node.style.backgroundColor = 'skyblue'
		//console.log(`mounted: ${this.data.count}`)
	},

	increment() {
		this.data.count++
	},

	decrement() {
		this.data.count--
	},
}
