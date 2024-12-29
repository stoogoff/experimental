
import { todoStore } from '../store.js'

export default {
	data: {
		todos: [],
	},

	computed: {
		totalTodos() {
			return this.data.todos.length
		},
		completeTodos() {
			return this.data.todos.filter(({ done }) => done).length
		},
	},

	created() {
		this.data.todos = todoStore.all()

		todoStore.on('add', (updated) => this.data.todos = [ ...this.data.todos, updated ])
		todoStore.on('remove', (updated) => {
			updated.done = true

			this.data.todos = this.data.todos.map(todo =>
				todo.id === updated.id ? { ...todo, done: true }: todo
			)
		})
	},
}
