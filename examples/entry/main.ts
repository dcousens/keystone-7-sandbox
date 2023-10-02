import { setup } from '@keystone-7/internals'
import { text } from '@keystone-7/internals/fields'

async function main () {
  const context = setup({
    lists: {
      Foo: {
        fields: {
          bar: text(),
        }
      }
    }
  })
}

main()
