
import { store } from '../store.js'

export default {
	data: {
		newTodo: '',
	},

	computed: {
		canAdd() {
			return this.data.newTodo !== ''
		},
		hasTodos() {
			return store.all().length > 0
		},
		todos() {
			return store.all()
		},
	},

	addTodo() {
		store.add({ text: this.data.newTodo, done: false })

		this.data.newTodo = ''
	},

	completeTodo(scope, evt) {
		store.remove(scope.data)
	}
}

