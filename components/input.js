
export default {
	data: {
		firstName: 'Stoo',
		lastName: 'Goff',
		text: 'Some text',
		age: 49,
		list1: [
			'Athena',
			'Artemis',
			'Hera',
		],
		list2: [
			{ id: 'aaa', text: 'Athena' },
			{ id: 'aab', text: 'Artemis' },
			{ id: 'aac', text: 'Hera' },
		],
	},

	computed: {
		fullName() {
			return `${this.data.firstName} ${this.data.lastName}`;
		},
	},
}