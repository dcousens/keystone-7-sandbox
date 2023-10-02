import foo from '@keystone-7/foo'
import { bar } from '@keystone-7/bar'

async function main () {
  const output = foo() + bar()

  console.log(output)
}

main()
