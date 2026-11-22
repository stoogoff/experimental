
export const EventKeys = {
	Change: 'change',
	Add: 'add',
	Remove: 'remove',
}

class BaseEvent extends CustomEvent {
	#value

	constructor(key, value) {
		super(key, {
			detail: {
				value,
			}
		})

		this.#value = value
	}

	get value() {
		return this.#value
	}

	valueOf() {
		return this.#value.valueOf()
	}
}

export class ChangeEvent extends BaseEvent {
	constructor(value) {
		super(EventKeys.Change, value)
	}
}

ChangeEvent.EventKey = EventKeys.Change

export class AddEvent extends BaseEvent {
	constructor(value) {
		super(EventKeys.Add, value)
	}
}

AddEvent.EventKey = EventKeys.Add

export class RemoveEvent extends BaseEvent {
	constructor(value) {
		super(EventKeys.Remove, value)
	}
}

RemoveEvent.EventKey = EventKeys.Remove

export class PropertyEvent extends BaseEvent {
	constructor(property, value) {
		super(PropertyEvent.EventKey(property), value)
	}
}

PropertyEvent.EventKey = (property) => `${EventKeys.Change}:${property}`
