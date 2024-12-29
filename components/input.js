
import { personStore } from '/store.js'

export default {
	data: {
		firstName: personStore.firstName,
		lastName: personStore.lastName,
		text: 'Some text',
		age: personStore.age,
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

	watch: {
		firstName(newValue, oldValue) {
			personStore.firstName = newValue
		},
		lastName(newValue, oldValue) {
			personStore.lastName = newValue
		},
		age(newValue, oldValue) {
			personStore.age = newValue
		},
	},

	created() {
		personStore.on('change', (key, newValue, oldValue) => {
			this.data[key] = newValue
		})
	},

	computed: {
		fullName() {
			return `${this.data.firstName} ${this.data.lastName}`;
		},
	},
}