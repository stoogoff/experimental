
import { Computed } from './computed.js'
import { List } from './list.js'
import { Model } from './model.js'
import { Signal } from './signal.js'

export const isSignal = value => value instanceof Signal
export const isModel = value => value instanceof Model
export const isList = value => value instanceof List
export const isComputed = value => value instanceof Computed

export const handlesChange = value => 
	isSignal(value) ||
	isModel(value) ||
	isList(value) ||
	isComputed(value)

export const handlesPropertyChange = value => isModel(value)
