
import { Signal } from './signal.js'

export class Computed extends Signal {
	constructor(fn, dependencies = []) {
		super(fn(...dependencies))

		for(const dependency of dependencies) {
			if(dependency instanceof Signal) {
				dependency.on(() => {
					this.value = fn(...dependencies)
				})
			}
		}
	}
}

export const computed = (fn, dependencies) => new Computed(fn, dependencies)
