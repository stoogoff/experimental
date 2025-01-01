
import { directives } from '/reactive/directives.js'
import Timer from '/examples/components/timer.js'
import Todo from '/examples/components/todo.js'
import TodoWatcher from '/examples/components/todo-watcher.js'
import Counter from '/examples/components/counter.js'
import Input from '/examples/components/input.js'

const CounterWrapper = {
	data: {
		counters: [
			{ count: 1 },
			{ count: 2 },
			{ count: 3 },
			{ count: 4 },
			{ count: 5 },
		]
	}
}

const Scope = {
	data: {
		scope: 'root',
		test1: 'Hello there!',
		test2: 'Yes, hello!',
	},

	clicky() {
		alert(`Click: ${ this.data.test1 }`)
	}
}

directives.registerComponent('timer', Timer)
directives.registerComponent('todo', Todo)
directives.registerComponent('todo-watcher', TodoWatcher)
directives.registerComponent('counter', Counter)
directives.registerComponent('counterWrapper', CounterWrapper)
directives.registerComponent('input', Input)
directives.load(document.body, Scope)
