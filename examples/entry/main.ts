import { writeFile } from 'node:fs/promises'
import { setup } from '@keystone-7/internals'
import { id, text, checkbox, relationship } from '@keystone-7/internals/fields'
import { graphql, printSchema } from 'graphql'

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
        },
        hooks: {
          resolveInput: async () => console.error('Post resolveInput'),
          beforeOperation: async () => console.error('Post beforeOperation'),
          afterOperation: async () => console.error('Post afterOperation')
        }
      },

      User: {
        fields: {
          id: id(),
          name: text(),
          admin: checkbox(),
          posts: relationship({ ref: 'Post', many: true })
        },
        hooks: {
          resolveInput: async () => console.error('Post resolveInput'),
          beforeOperation: async () => console.error('Post beforeOperation'),
          afterOperation: async () => console.error('Post afterOperation')
        }
      }
    }
  })

  await writeFile('./schema.graphql', printSchema(context.schema))

  const result = await graphql({
    schema: context.schema,
    source: `
      query test {
        user (where: {
          id: "test"
        }) {
          name
        }
      }
    `
  })
  console.error(JSON.stringify({ result }, null, 2))
}

main()
