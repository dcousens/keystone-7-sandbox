import foo from '@dcousens/foo'
import { bar } from '@dcousens/bar'

function test () {
  const output = foo() + bar()

  if (output !== 'foobar') {
    throw new Error('invalid')
  }
}

test()
