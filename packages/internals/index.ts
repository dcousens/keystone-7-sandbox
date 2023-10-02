import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  printSchema
} from 'graphql'

import type { Configuration } from './types'

const PRISMA_GRAPHQL_TYPE_MAPPING = {
  'Boolean': GraphQLBoolean,
  'DateTime': GraphQLString,
  'Int': GraphQLInt,
  'String': GraphQLString
}

type PrismaClient = {
  [modelKey: string]: {
    findUnique: (args: unknown) => unknown
    create: (args: unknown) => unknown
  }
}

export async function setup (prisma: PrismaClient, {
  lists
}: Configuration) {
  const graphqlListTypes = Object.entries(lists).map(([listKey, listConfig]) => {
    console.error({ listKey, listConfig })

    const { fields } = listConfig
    const graphqlFieldTypes = Object.entries(fields).map(([fieldKey, fieldConfig]) => {
      if (!fieldConfig) return // ...? Typescript

      const fieldGraphQLInputType = fieldConfig?.graphql?.input?.type ?? PRISMA_GRAPHQL_TYPE_MAPPING[fieldConfig.prisma.type]
      const fieldGraphQLOutputType = fieldConfig?.graphql?.output?.type ?? PRISMA_GRAPHQL_TYPE_MAPPING[fieldConfig.prisma.type]

      return {
        fieldKey,
        input: {
          type: new GraphQLNonNull(fieldGraphQLInputType),
          resolve: (parent: any) => parent[fieldKey],
        },
        output: {
          type: new GraphQLNonNull(fieldGraphQLOutputType),
          resolve: (parent: any) => parent[fieldKey],
        }
      }
    }).filter((x): x is Exclude<typeof x, undefined> => !!x)

    const prismaListKey = listKey.toLowerCase()
    const listInputType = new GraphQLInputObjectType({
      name: listKey,
      fields: {
        ...graphqlFieldTypes.reduce((a, x) => ({ ...a, [x.fieldKey]: x.input }), {}),
      },
    })

    const listOutputType = new GraphQLObjectType({
      name: listKey,
      fields: {
        ...graphqlFieldTypes.reduce((a, x) => ({ ...a, [x.fieldKey]: x.output }), {}),
      },
    })

    const graphqlIdType = PRISMA_GRAPHQL_TYPE_MAPPING[listConfig.fields.id.prisma.type]
    return {
      listKey,
      query: {
        type: listOutputType,
        args: {
          id: {
            type: new GraphQLNonNull(graphqlIdType)
          }
        },
        resolve: async (parent: any, where: {
          id: string
        }) => {
          return await prisma[prismaListKey].findUnique({ where, })
        }
      },

      mutations: {
        create: {
          type: listOutputType,
          args: {
            data: {
              type: new GraphQLNonNull(listInputType)
            }
          },
          resolve: async (parent: any, { data }: { data: unknown }) => {
            return await prisma[prismaListKey].create({ data, })
          },
        }
      }
    }
  })

  const Query = new GraphQLObjectType<undefined, number>({
    name: 'Query',
    fields: {
      ...graphqlListTypes.reduce((a, x) => ({ ...a, [x.listKey]: x.query }), {}),
    },
  })

  const Mutation = new GraphQLObjectType<undefined, number>({
    name: 'Mutation',
    fields: {
      ...graphqlListTypes.reduce((a, x) => ({ ...a, [`create${x.listKey}`]: x.mutations.create }), {}),
    },
  })

  const schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation
  })

  return {
    schema
  }
}
