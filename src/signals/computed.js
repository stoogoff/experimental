
import { Signal } from './signal.js'
import { handlesChange } from './utils.js'

export class Computed extends Signal {
	constructor(fn, dependencies = []) {
		super(fn(...dependencies))

		for(const dependency of dependencies) {
			if(handlesChange(dependency)) {
				dependency.on(() => {
					this.value = fn(...dependencies)
				})
			}
		}
	}
}

export const computed = (fn, dependencies) => new Computed(fn, dependencies)
