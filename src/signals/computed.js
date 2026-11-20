
import { Signal } from './signal.js'
import { Model } from './model.js'

export class Computed extends Signal {
	constructor(fn, dependencies = []) {
		super(fn(...dependencies))

		for(const dependency of dependencies) {
			// For models this is regesterig for any change on the model, even if it only needs
			// some properties0
			if(dependency instanceof Signal || dependency instanceof Model) {
				dependency.on(() => {
					this.value = fn(...dependencies)
				})
			}
		}
	}
}

export const computed = (fn, dependencies) => new Computed(fn, dependencies)
