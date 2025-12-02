
import { ProxiedModel, ListStore } from '../src/data/index.js'

//export const todoStore = new CollectionStore([{ id: 1, text: 'Cooking', done: false }])
export const todoStore = new ListStore([])
export const personStore = new ProxiedModel({
	firstName: 'Stoo',
	lastName: 'Goff',
	age: 49,
})

todoStore.on('change', data => console.log(data))
