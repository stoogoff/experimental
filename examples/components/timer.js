
export default {
	data: {
		count: 0,
		timer: null,
	},

	computed: {
		active() {
			return this.data.timer !== null
		}
	},

	start() {
		if(!this.data.timer) {
			this.data.timer = setInterval(() => this.data.count++, 1000)
		}
	},

	stop() {
		if(this.data.timer) {
			clearInterval(this.data.timer)
			this.data.timer = null
		}
	},

	reset() {
		this.stop()
		this.data.count = 0
	},
}
