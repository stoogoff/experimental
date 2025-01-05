
import { Component } from '../component.js'

export const component = (node, property, scope, directives) => {
	const component = directives.getComponent(property)
	const newComponent = new Component(node, component, scope.data)

	directives.loadDirectivesForNode(node, newComponent)

	newComponent.mounted()

	return true
}
