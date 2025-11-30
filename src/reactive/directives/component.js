
import { Component } from '../component.js'
import { logger } from '../config.js'

export const component = (node, property, scope, directives) => {
	logger().info(`component (directive): loading component '${ property }'`, scope)

	const component = directives.getComponent(property)
	const newComponent = new Component(node, component, scope.data)

	directives.loadDirectivesForNode(node, newComponent)

	newComponent.mounted()

	return true
}
