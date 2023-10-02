import { setup } from '@keystone-7/internals'
import { id, text } from '@keystone-7/internals/fields'
import { PrismaClient } from './.myprisma/client'

async function main () {
  const prisma = new PrismaClient()
  const context = setup(prisma, {
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
