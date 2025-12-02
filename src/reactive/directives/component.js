
import { Component } from '../component.js'
import { directives } from '../directives.js'
import { logger } from '../config.js'

export const component = (context) => {
	logger().info(`component (directive): loading component '${ context.property }'`, context.scope)

	const component = directives.getComponent(context.property)
	const newComponent = new Component(context.node, component, context.scope.data)

	directives.loadDirectivesForNode(context.node, newComponent)

	newComponent.mounted()

	return true
}
