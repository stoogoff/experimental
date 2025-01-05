
import { ObjectStore, CollectionStore } from '/store/index.js'

//export const todoStore = new CollectionStore([{ id: 1, text: 'Cooking', done: false }])
export const todoStore = new CollectionStore([])
export const personStore = new ObjectStore({
	firstName: 'Stoo',
	lastName: 'Goff',
	age: 49,
})
