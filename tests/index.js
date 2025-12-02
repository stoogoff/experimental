// data
import * as proxy from './data/proxy.test.js'
import * as proxiedModel from './data/model.test.js'
import * as listStore from './data/list-store.test.js'
import * as setStore from './data/set-store.test.js'

// reactive
import * as context from './reactive/context.test.js'
import * as directives from './reactive/directives.test.js'

// reactive directives
import * as attribute from './reactive/directives/attribute.test.js'
import * as bool from './reactive/directives/boolean.test.js'
import * as event from './reactive/directives/event.test.js'
import * as input from './reactive/directives/input.test.js'
import * as text from './reactive/directives/text.test.js'

// utils
import * as assert from './utils/assert.test.js'
import * as date from './utils/date.test.js'
import * as emitter from './utils/emitter.test.js'
import * as list from './utils/list.test.js'
import * as logger from './utils/logger.test.js'
import * as string from './utils/string.test.js'
import * as storage from './utils/storage.test.js'

import { run, consoleRenderer } from '../src/test/index.js'

run(consoleRenderer)
