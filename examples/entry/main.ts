import { setup } from '@keystone-7/internals'
import { text } from '@keystone-7/internals/fields'

async function main () {
  setup({
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
