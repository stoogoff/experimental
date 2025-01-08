
import { ObjectStore, CollectionStore } from '/store/index.js'

//export const todoStore = new CollectionStore([{ id: 1, text: 'Cooking', done: false }])
export const todoStore = new CollectionStore([], item => ({ id: JSON.stringify(item), ...item }))
export const personStore = new ObjectStore({
	firstName: 'Stoo',
	lastName: 'Goff',
	age: 49,
})

todoStore.on('change', data => console.log(data))
