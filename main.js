
import { directives } from '/reactive/directives.js'
import Timer from '/components/timer.js'
import Todo from '/components/todo.js'
import TodoWatcher from '/components/todo-watcher.js'
import Counter from '/components/counter.js'
import Input from '/components/input.js'

directives.registerComponent('timer', Timer)
directives.registerComponent('todo', Todo)
directives.registerComponent('todo-watcher', TodoWatcher)
directives.registerComponent('counter', Counter)
directives.registerComponent('input', Input)
directives.load(document.body)
