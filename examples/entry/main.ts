import { writeFile } from 'node:fs/promises'
import { setup } from '@keystone-7/internals'
import { id, text, checkbox, relationship } from '@keystone-7/internals/fields'
import { printSchema } from 'graphql'

import { PrismaClient } from './.myprisma/client'

async function main () {
  const prisma = new PrismaClient()
  const context = await setup(prisma, {
    lists: {
      Post: {
        fields: {
          id: id(),
          title: text(),
          context: text(),
          author: relationship({ ref: 'User' }),
        }
      },

      User: {
        fields: {
          id: id(),
          name: text(),
          admin: checkbox(),
          posts: relationship({ ref: 'Post', many: true })
        }
      }
    }
  })

  await writeFile('./schema.graphql', printSchema(context.schema))
}

main()
