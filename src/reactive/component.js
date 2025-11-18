
import { logger } from './config.js'
import { Emitter } from './emitter.js'
import { isFunction } from '../utils/assert.js'

export class Component extends Emitter {
	#computed = {};

	constructor(node, component = {}, attributes = {}) {
		super()

		this.node = node
		this.created = () => {}
		this.mounted = () => {}

		this.data = new Proxy({ ...component.data }, this)

		if(component.watch) {
			Object.keys(component.watch).forEach(watcher => {
				this.on(`change:${watcher}`, (key, value, old) => {
					component.watch[watcher].call(this, value, old)
				})
			})
		}

		if(component.computed) {
			Object.keys(component.computed).forEach(comp => {
				this.#computed[comp] = component.computed[comp].bind(this)

				let lastValue = this.#computed[comp]()

				this.on('change', (key, value, old) => {
					const newValue = this.#computed[comp]()

					if(lastValue === newValue) return

					this.emit(`change:${comp}`, comp, newValue, lastValue)

					lastValue = newValue
				})
			})
		}

		const skipProperties = ['data', 'watch', 'computed']

		Object.keys(component).forEach(key => {
			if(skipProperties.includes(key)) {
				return
			}

			this[key] = component[key]
		})

		Object.keys(attributes).forEach(key => {
			this.data[key] = attributes[key]
		})

		this.created()
	}

	get(target, prop, receiver) {
		if(prop in this.#computed) {
			return this.#computed[prop]()
		}

		return target[prop]
	}

	set(target, prop, value) {
		const oldValue = target[prop]

		if(oldValue === value) return true

		target[prop] = value

		this.emit('change', prop, value, oldValue)
		this.emit(`change:${prop}`, prop, value, oldValue)

		return true
	}

	clone(data) {
		const skipProperties = ['node', 'data', 'watch', 'mounted', 'created', 'ref', 'events']
		const newScope = {
			data: new Proxy(data, this),
			emit: this.emit.bind(this),
			on: this.on.bind(this),
			off: this.off.bind(this),
		}

		Object.keys(this).forEach(key => {
			if(skipProperties.includes(key)) {
				return
			}

			logger().info('component.clone :: binding function', key, this[key])

			if(isFunction(this[key])) {
				newScope[key] = this[key].bind(this)
			}
		})

		logger().info('component.clone :: new scope', newScope)

		return newScope
	}
}
