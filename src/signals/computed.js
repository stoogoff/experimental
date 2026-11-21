
import { List } from './list.js'
import { Model } from './model.js'
import { Signal } from './signal.js'

export class Computed extends Signal {
	constructor(fn, dependencies = []) {
		super(fn(...dependencies))

		for(const dependency of dependencies) {
			// For models this is regesterig for any change on the model, even if it only needs
			// some properties
			// Maybe that's OK? You can do
			// x = computed(fn, [model])
			// And suffer the performance hit, or
			// x = computed(fn, [model.firstname, model.lastname])
			// it could also be that Computed doesn't restrict to types and accepts
			// anything which has an `on` method
			if(dependency instanceof Signal || dependency instanceof Model || dependency instanceof List) {
				dependency.on(() => {
					this.value = fn(...dependencies)
				})
			}
		}
	}
}

export const computed = (fn, dependencies) => new Computed(fn, dependencies)
