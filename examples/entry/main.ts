import { setup } from '@keystone-7/internals'
import { id, text } from '@keystone-7/internals/fields'

async function main () {
  const context = setup({
    lists: {
      Post: {
        fields: {
          id: id(),
          title: text(),
          context: text(),
        }
      }
    }
  })
}

main()
