
import { todoStore } from '../store.js'

export default {
	data: {
		newTodo: '',
	},

	computed: {
		canAdd() {
			return this.data.newTodo !== ''
		},
		hasTodos() {
			return todoStore.all().length > 0
		},
		todos() {
			return todoStore.all()
		},
	},

	addTodo() {
		todoStore.add({ text: this.data.newTodo, done: false })

		this.data.newTodo = ''
	},

	completeTodo(evt, scope) {
		console.log(this.data)
		todoStore.remove(scope.data)
	}
}

