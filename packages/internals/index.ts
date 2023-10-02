import type { Configuration, Context } from './types'
import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql'
import type { PrismaClient } from '@prisma/client'
import { printSchema } from 'graphql'

const PRISMA_GRAPHQL_TYPE_MAPPING = {
  'Int': GraphQLInt,
  'String': GraphQLString
}

export function setup (prisma: PrismaClient, {
  lists
}: Configuration): Context {
  console.error({ lists })

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

          const mappedIdType = listConfig.fields.id.prisma.type
          yield {
            [listKey]: {
              type: listType,
              args: {
                id: {
                  type: new GraphQLNonNull(GraphQLString)
                }
              },
              resolve: async (parent: any, args: {
                id: string
              }) => {
                return await prisma.post.findUnique({
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

  console.log({ gql: printSchema(schema) })
  return {
  }
}
