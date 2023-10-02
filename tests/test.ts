import { test, beforeEach } from 'node:test'
import { equal } from 'node:assert/strict'

import foo from '@keystone-7/foo'
import { bar } from '@keystone-7/bar'

test(() => {
  const output = foo() + bar()

  equal(output, 'foo3600000bar')
})
