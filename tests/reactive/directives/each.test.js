import { describe, assert } from '../../../src/test/index.js'
import { ProxiedModel } from '../../../src/data/model.js'
import { each } from '../../../src/reactive/directives/each.js'

class MockElement {
	constructor(tag = 'div') {
		this.tag = tag
		this.attributes = {}
		this.children = []
		this.parentNode = null
		this.previousElementSibling = null
	}

	setAttribute(key, value) {
		this.attributes[key] = value
	}

	getAttribute(key) {
		return this.attributes[key] ?? null
	}

	hasAttribute(key) {
		return key in this.attributes
	}

	cloneNode(deep) {
		const clone = new MockElement(this.tag)
		clone.attributes = { ...this.attributes }
		if (deep) {
			clone.children = this.children.map(child => {
				const cloned = child.cloneNode(true)
				cloned.parentNode = clone
				return cloned
			})
		}
		return clone
	}

	replaceWith(...nodes) {
		if (!this.parentNode) return
		const parent = this.parentNode
		const index = parent.children.indexOf(this)
		if (index === -1) return
		nodes.forEach(node => { node.parentNode = parent })
		parent.children.splice(index, 1, ...nodes)
		this.parentNode = null
	}

	insertAdjacentElement(position, element) {
		if (!this.parentNode) return
		const parent = this.parentNode
		const index = parent.children.indexOf(this)
		if (position === 'afterend') {
			element.parentNode = parent
			parent.children.splice(index + 1, 0, element)
		}
		return element
	}

	remove() {
		if (!this.parentNode) return
		const parent = this.parentNode
		const index = parent.children.indexOf(this)
		if (index !== -1) {
			parent.children.splice(index, 1)
		}
		this.parentNode = null
	}

	appendChild(child) {
		child.parentNode = this
		this.children.push(child)
		return child
	}

	hasChildNodes() {
		return false
	}

	querySelectorAll(selector) {
		const match = selector.match(/\*\[data-ref=([^\]]+)\]/)
		if (!match) return []
		const ref = match[1]
		const results = []
		const search = (node) => {
			if (node.attributes && node.attributes['data-ref'] === ref) {
				results.push(node)
			}
			if (node.children) {
				node.children.forEach(search)
			}
		}
		this.children.forEach(search)
		return results
	}
}

const createMockContext = (node, property, scope) => ({
	node,
	property,
	scope,
	get value() {
		return scope[property]
	},
	set value(val) {
		scope[property] = val
	},
})

const setupParent = (node) => {
	const parent = new MockElement('div')
	const sibling = new MockElement('div')
	parent.appendChild(sibling)
	parent.appendChild(node)
	node.previousElementSibling = sibling
	return parent
}

describe('reactive/directives/each: initial render', test => {
	test('creates nodes for each item in the array', () => {
		const node = new MockElement('li')
		const parent = setupParent(node)
		const scope = new ProxiedModel({
			items: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }],
		})
		const context = createMockContext(node, 'items', scope)

		each(context)

		// original node replaced, sibling + 3 new nodes
		assert(parent.children.length).isEqual(4)
	})

	test('creates no nodes for an empty array', () => {
		const node = new MockElement('li')
		const parent = setupParent(node)
		const scope = new ProxiedModel({
			items: [],
		})
		const context = createMockContext(node, 'items', scope)

		each(context)

		// only the sibling remains
		assert(parent.children.length).isEqual(1)
	})

	test('sets data-current attribute on each created node', () => {
		const node = new MockElement('li')
		const parent = setupParent(node)
		const scope = new ProxiedModel({
			items: [{ name: 'Alice' }, { name: 'Bob' }],
		})
		const context = createMockContext(node, 'items', scope)

		each(context)

		const itemNodes = parent.children.slice(1)
		assert(itemNodes[0].getAttribute('data-current')).isEqual(JSON.stringify({ name: 'Alice' }))
		assert(itemNodes[1].getAttribute('data-current')).isEqual(JSON.stringify({ name: 'Bob' }))
	})

	test('sets data-ref attribute on each created node', () => {
		const node = new MockElement('li')
		const parent = setupParent(node)
		const scope = new ProxiedModel({
			items: [{ name: 'Alice' }],
		})
		const context = createMockContext(node, 'items', scope)

		each(context)

		const itemNode = parent.children[1]
		assert(itemNode.getAttribute('data-ref')).notNull()
	})

	test('handles null value as empty array', () => {
		const node = new MockElement('li')
		const parent = setupParent(node)
		const scope = new ProxiedModel({
			items: null,
		})
		const context = createMockContext(node, 'items', scope)

		each(context)

		assert(parent.children.length).isEqual(1)
	})
})

describe('reactive/directives/each: adding items', test => {
	test('adds new nodes when items are appended', () => {
		const node = new MockElement('li')
		const parent = setupParent(node)
		const scope = new ProxiedModel({
			items: [{ name: 'Alice' }],
		})
		const context = createMockContext(node, 'items', scope)

		each(context)
		assert(parent.children.length).isEqual(2)

		scope.items = [{ name: 'Alice' }, { name: 'Bob' }]
		assert(parent.children.length).isEqual(3)
	})

	test('adds nodes from an empty list', () => {
		const node = new MockElement('li')
		const parent = setupParent(node)
		const scope = new ProxiedModel({
			items: [],
		})
		const context = createMockContext(node, 'items', scope)

		each(context)
		assert(parent.children.length).isEqual(1)

		scope.items = [{ name: 'Alice' }, { name: 'Bob' }]
		assert(parent.children.length).isEqual(3)
	})
})

describe('reactive/directives/each: removing items', test => {
	test('removes nodes when items are removed from the end', () => {
		const node = new MockElement('li')
		const parent = setupParent(node)
		const scope = new ProxiedModel({
			items: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }],
		})
		const context = createMockContext(node, 'items', scope)

		each(context)
		assert(parent.children.length).isEqual(4)

		scope.items = [{ name: 'Alice' }]
		assert(parent.children.length).isEqual(2)
	})

	test('removes nodes when items are removed from the beginning', () => {
		const node = new MockElement('li')
		const parent = setupParent(node)
		const scope = new ProxiedModel({
			items: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }],
		})
		const context = createMockContext(node, 'items', scope)

		each(context)
		assert(parent.children.length).isEqual(4)

		scope.items = [{ name: 'Bob' }, { name: 'Charlie' }]
		assert(parent.children.length).isEqual(3)
	})

	test('removes nodes when items are removed from the middle', () => {
		const node = new MockElement('li')
		const parent = setupParent(node)
		const scope = new ProxiedModel({
			items: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }],
		})
		const context = createMockContext(node, 'items', scope)

		each(context)
		assert(parent.children.length).isEqual(4)

		scope.items = [{ name: 'Alice' }, { name: 'Charlie' }]
		assert(parent.children.length).isEqual(3)
	})

	test('removes all nodes when set to empty array', () => {
		const node = new MockElement('li')
		const parent = setupParent(node)
		const scope = new ProxiedModel({
			items: [{ name: 'Alice' }, { name: 'Bob' }],
		})
		const context = createMockContext(node, 'items', scope)

		each(context)
		assert(parent.children.length).isEqual(3)

		scope.items = []
		assert(parent.children.length).isEqual(1)
	})
})

describe('reactive/directives/each: updating items', test => {
	test('replaces node when item value changes', () => {
		const node = new MockElement('li')
		const parent = setupParent(node)
		const scope = new ProxiedModel({
			items: [{ name: 'Alice' }, { name: 'Bob' }],
		})
		const context = createMockContext(node, 'items', scope)

		each(context)
		assert(parent.children.length).isEqual(3)
		assert(parent.children[1].getAttribute('data-current')).isEqual(JSON.stringify({ name: 'Alice' }))
		assert(parent.children[2].getAttribute('data-current')).isEqual(JSON.stringify({ name: 'Bob' }))

		scope.items = [{ name: 'Alice' }, { name: 'Charlie' }]
		assert(parent.children.length).isEqual(3)
		assert(parent.children[1].getAttribute('data-current')).isEqual(JSON.stringify({ name: 'Alice' }))
		assert(parent.children[2].getAttribute('data-current')).isEqual(JSON.stringify({ name: 'Charlie' }))
	})

	test('skips node when item value has not changed', () => {
		const node = new MockElement('li')
		const parent = setupParent(node)
		const scope = new ProxiedModel({
			items: [{ name: 'Alice' }, { name: 'Bob' }],
		})
		const context = createMockContext(node, 'items', scope)

		each(context)
		const originalFirst = parent.children[1]

		scope.items = [{ name: 'Alice' }, { name: 'Charlie' }]

		// first node should be the same reference since its value didn't change
		assert(parent.children[1]).isEqual(originalFirst)
	})

	test('handles simultaneous add and remove', () => {
		const node = new MockElement('li')
		const parent = setupParent(node)
		const scope = new ProxiedModel({
			items: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }],
		})
		const context = createMockContext(node, 'items', scope)

		each(context)
		assert(parent.children.length).isEqual(4)

		scope.items = [{ name: 'Alice' }, { name: 'Dave' }]
		assert(parent.children.length).isEqual(3)
		assert(parent.children[1].getAttribute('data-current')).isEqual(JSON.stringify({ name: 'Alice' }))
		assert(parent.children[2].getAttribute('data-current')).isEqual(JSON.stringify({ name: 'Dave' }))
	})
})

describe('reactive/directives/each: multiple updates', test => {
	test('handles successive updates correctly', () => {
		const node = new MockElement('li')
		const parent = setupParent(node)
		const scope = new ProxiedModel({
			items: [{ name: 'Alice' }],
		})
		const context = createMockContext(node, 'items', scope)

		each(context)
		assert(parent.children.length).isEqual(2)

		scope.items = [{ name: 'Alice' }, { name: 'Bob' }]
		assert(parent.children.length).isEqual(3)

		scope.items = [{ name: 'Charlie' }]
		assert(parent.children.length).isEqual(2)
		assert(parent.children[1].getAttribute('data-current')).isEqual(JSON.stringify({ name: 'Charlie' }))

		scope.items = []
		assert(parent.children.length).isEqual(1)

		scope.items = [{ name: 'Dave' }, { name: 'Eve' }]
		assert(parent.children.length).isEqual(3)
	})
})
