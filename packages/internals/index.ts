import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  printSchema
} from 'graphql'
import type { PrismaClient } from '@prisma/client'

import type { Configuration } from './types'

const PRISMA_GRAPHQL_TYPE_MAPPING = {
  'Boolean': GraphQLBoolean,
  'DateTime': GraphQLString,
  'Int': GraphQLInt,
  'String': GraphQLString
}

export async function setup (prisma: PrismaClient, {
  lists
}: Configuration) {
  const Query = new GraphQLObjectType<undefined, number>({
    name: 'Query',
    fields: {
      ...[...(function* () {
        for (const [listKey, listConfig] of Object.entries(lists)) {
//            console.error({ listKey, listConfig })

          const { fields } = listConfig
          const listType = new GraphQLObjectType({
            name: listKey,
            fields: {
              ...[...(function* () {
                for (const [fieldKey, fieldConfig] of Object.entries(fields)) {
//                    console.error({ fieldKey, fieldConfig })
                  if (!fieldConfig) continue // ...? Typescript

                  const mappedType = PRISMA_GRAPHQL_TYPE_MAPPING[fieldConfig.prisma.type]
                  yield {
                    [fieldKey]: {
                      type: new GraphQLNonNull(mappedType),
                      resolve: (parent: any) => parent[fieldKey],
                    },
                  }
                }
              }())].reduce((a, x) => ({ ...a, ...x }), {})
            },
          })

          const prismaListKey = listKey.toLowerCase()
          const mappedIdType = PRISMA_GRAPHQL_TYPE_MAPPING[listConfig.fields.id.prisma.type]
          yield {
            [listKey]: {
              type: listType,
              args: {
                id: {
                  type: new GraphQLNonNull(mappedIdType)
                }
              },
              resolve: async (parent: any, args: {
                id: string
              }) => {
                return await prisma[prismaListKey].findUnique({
                  where: { id: args.id },
                })
              },
            },
          }
        }
      }())].reduce((a, x) => ({ ...a, ...x }), {})
    },
  })

  const schema = new GraphQLSchema({
    query: Query,
  })

  return {
    schema
  }
}
