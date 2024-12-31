
import { directives } from '/reactive/directives.js'
import Timer from '/examples/components/timer.js'
import Todo from '/examples/components/todo.js'
import TodoWatcher from '/examples/components/todo-watcher.js'
import Counter from '/examples/components/counter.js'
import Input from '/examples/components/input.js'

directives.registerComponent('timer', Timer)
directives.registerComponent('todo', Todo)
directives.registerComponent('todo-watcher', TodoWatcher)
directives.registerComponent('counter', Counter)
directives.registerComponent('input', Input)
directives.load(document.body)
