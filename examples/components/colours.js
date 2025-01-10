
export default {
	data: {
		title: '',
		currentColour: null,
	},

	computed: {
		colours() {
			return [
				{ colour: '#4B5563' },
				{ colour: '#DC2626' },
				{ colour: '#D97706' },
				{ colour: '#059669' },
				{ colour: '#2563EB' },
				{ colour: '#7C3AED' },
			]
		},
	},

	setColour(evt) {
		if(this.currentTarget) {
			this.currentTarget.style.border = ''
		}

		this.currentTarget = evt.target
		this.currentTarget.style.border = '2px solid rgba(0, 0, 0, 0.8)'
		this.data.currentColour = this.currentTarget.style.backgroundColor
	},
}
