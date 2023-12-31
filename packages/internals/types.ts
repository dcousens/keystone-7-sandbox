import type { GraphQLInputType, GraphQLOutputType } from 'graphql';

export type FieldConfiguration = {
  graphql?: {
    input?: {
      type: GraphQLInputType
    }
    output?: {
      type: GraphQLOutputType
    }
  }
  prisma: {
    type: 'Boolean' | 'DateTime' | 'Int' | 'String' | {
      name: string,
      fields: string[],
      references: string[]
    }
    modifiers: {
      list: boolean // default false
      optional: boolean // default false
    },
    attributes: {
      id: boolean,
      default: string | null
      map: string | null
      unique: boolean
    },
  }
  hooks: {
    resolveInput: (data: any) => Promise<unknown>
    beforeOperation: (data: any) => Promise<unknown>
    afterOperation: (data: any) => Promise<unknown>
  }
}

export type ListConfiguration = {
  fields: {
    id: FieldConfiguration
    [key: string]: FieldConfiguration
  }
  hooks: {
    resolveInput: (data: any) => Promise<unknown>
    beforeOperation: (data: any) => Promise<unknown>
    afterOperation: (data: any) => Promise<unknown>
  }
}

export type Configuration = {
  lists: {
    [key: string]: ListConfiguration
  }
}

export type Context = {} // TODO
