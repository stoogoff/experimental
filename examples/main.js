
import { directives } from '/reactive/directives.js'
import { DIRECTIVES_LOG_KEY } from '/reactive/config.js'
import Timer from '/examples/components/timer.js'
import Todo from '/examples/components/todo.js'
import TodoWatcher from '/examples/components/todo-watcher.js'
import Counter from '/examples/components/counter.js'
import Input from '/examples/components/input.js'
import Colours from '/examples/components/colours.js'
import { setLogger, ConsoleLogger } from '/utils/logger.js'

setLogger(DIRECTIVES_LOG_KEY, ConsoleLogger, 4)

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
		file: 'earth.html',
	},

	clicky() {
		alert(`Click: ${ this.data.test1 }`)
	},

	changeFile() {
		this.data.file = this.data.file === 'earth.html' ? 'mars.html' : 'earth.html'
	},

	errorFile() {
		this.data.file = 'error.html'
	},
}

directives.register('colour', (node, property, scope) => {
	node.style.backgroundColor = scope.data[property]

	return false
})

directives.registerComponent('colours', Colours)
directives.registerComponent('timer', Timer)
directives.registerComponent('todo', Todo)
directives.registerComponent('todo-watcher', TodoWatcher)
directives.registerComponent('counter', Counter)
directives.registerComponent('counterWrapper', CounterWrapper)
directives.registerComponent('input', Input)
directives.load(document.body, Scope)
