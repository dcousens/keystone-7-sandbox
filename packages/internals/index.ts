import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  printSchema
} from 'graphql'

import type { Configuration, FieldConfiguration } from './types'

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

function resolveGraphQLTypeList (list: boolean, thing: any) {
  return list ? new GraphQLList(thing) : thing
}

function resolveGraphQLType (
  listTypesMap: Record<string, GraphQLObjectType>,
  {
    prisma: {
      type,
      modifiers: {
        list,
        optional
      }
    },
  }: FieldConfiguration,
) {
  if (typeof type === 'string') {
    return resolveGraphQLTypeList(list, PRISMA_GRAPHQL_TYPE_MAPPING[type])
  }

  return resolveGraphQLTypeList(list, listTypesMap[type.name])
}

export async function setup (prisma: PrismaClient, {
  lists
}: Configuration) {
  const graphqlListOutputTypesMap: Record<string, GraphQLObjectType> = {}

  const graphqlListTypes = Object.entries(lists).map(([listKey, listConfig]) => {
    const { fields } = listConfig
    const prismaListKey = listKey.toLowerCase()
    const listInputType = new GraphQLInputObjectType({
      name: `${listKey}Input`,
      fields: () => {
        const graphqlFieldTypes = Object.entries(fields).map(([fieldKey, fieldConfig]) => {
          return {
            fieldKey,
            type: fieldConfig?.graphql?.input?.type ?? resolveGraphQLType(graphqlListOutputTypesMap, fieldConfig)
          }
        })

        return graphqlFieldTypes.reduce((a, x) => ({ ...a, [x.fieldKey]: { type: x.type } }), {})
      },
    })

    const listOutputType = new GraphQLObjectType({
      name: listKey,
      fields: () => {
        const graphqlFieldTypes = Object.entries(fields).map(([fieldKey, fieldConfig]) => {
          return {
            fieldKey,
            type: fieldConfig?.graphql?.output?.type ?? resolveGraphQLType(graphqlListOutputTypesMap, fieldConfig)
          }
        })

        return graphqlFieldTypes.reduce((a, x) => ({ ...a, [x.fieldKey]: {
          type: x.type,
          resolve: (parent: any) => parent[x.fieldKey]
        } }), {})
      },
    })

    graphqlListOutputTypesMap[listKey] = listOutputType

    const graphqlIdType = resolveGraphQLType(graphqlListOutputTypesMap, listConfig.fields.id)
    return {
      listKey,
      inputType: listInputType,
      outputType: listOutputType,

      query: {
        type: listOutputType,
        args: {
          id: {
            type: graphqlIdType
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
      ...graphqlListTypes
        .filter(x => x.query)
        .reduce((a, x) => ({ ...a, [x.listKey]: x.query }), {}),
    },
  })

  const Mutation = new GraphQLObjectType<undefined, number>({
    name: 'Mutation',
    fields: {
      ...graphqlListTypes
        .filter(x => x.mutations.create)
        .reduce((a, x) => ({ ...a, [`create${x.listKey}`]: x.mutations.create }), {}),
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
