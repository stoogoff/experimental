
export const EventKeys = {
	Change: 'change',
	Add: 'add',
	Remove: 'remove',
}

export class ChangeEvent extends CustomEvent {
	constructor(value) {
		super(EventKeys.Change, {
			detail: {
				value,
			},
		})
	}
}

ChangeEvent.EventKey = EventKeys.Change

export class AddEvent extends CustomEvent {
	constructor(value) {
		super(EventKeys.Add, {
			detail: {
				value,
			},
		})
	}
}

AddEvent.EventKey = EventKeys.Add

export class RemoveEvent extends CustomEvent {
	constructor(value) {
		super(EventKeys.Remove, {
			detail: {
				value,
			},
		})
	}
}

RemoveEvent.EventKey = EventKeys.Remove

export class PropertyEvent extends CustomEvent {
	constructor(property, value) {
		super(PropertyEvent.EventKey(property), {
			detail: {
				value,
			},
		})
	}
}

PropertyEvent.EventKey = (property) => `${EventKeys.Change}:${property}`
