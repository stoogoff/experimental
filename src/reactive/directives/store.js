
import { directives } from "../directives.js"

export const store = (context) => {
	const store = directives.getStore(context.property)

	// TODO store needs to maintain the current context

	directives.loadDirectivesForNode(context.node, store)

	return true
}
