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

function resolveGraphQLType <T extends GraphQLInputObjectType | GraphQLObjectType>(
  listTypesMap: Record<string, T>,
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
  const graphqlListInputTypesMap: Record<string, GraphQLInputObjectType> = {}
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
            type: fieldConfig?.graphql?.input?.type ?? resolveGraphQLType(graphqlListInputTypesMap, fieldConfig)
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
          resolve: (parent: any) => {
            return parent[x.fieldKey]
          }
        } }), {})
      },
    })

    const listUniqueWhereType = new GraphQLInputObjectType({
      name: `${listKey}WhereUniqueInput`,
      fields: () => ({
        id: {
          type: resolveGraphQLType(graphqlListOutputTypesMap, listConfig.fields.id)
        }
      })
    })

    graphqlListInputTypesMap[listKey] = listInputType
    graphqlListOutputTypesMap[listKey] = listOutputType
    return {
      listKey,
      inputType: listInputType,
      outputType: listOutputType,
      query: {
        type: listOutputType,
        args: {
          where: {
            type: listUniqueWhereType
          }
        },
        resolve: async (_: any, { where }: {
          where: {
            id: string
          }
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
          resolve: async (_: any, { data }: { data: unknown }) => {
            const data2 = await listConfig.hooks.resolveInput(data)

            await listConfig.hooks.beforeOperation(data2)

            const result = await prisma[prismaListKey].create({ data: data2, })

            await listConfig.hooks.afterOperation(data2)

            return result
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
        .reduce((a, x) => ({ ...a, [x.listKey.toLowerCase()]: x.query }), {}),
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
