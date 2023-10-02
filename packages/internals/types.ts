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
      optional: boolean
      array?: boolean
    },
    attributes: {
      id?: boolean,
      default?: string
      map?: string
      unique?: boolean
    },
  }
  hooks: {
    resolveInput: () => Promise<unknown>
    beforeOperation: () => Promise<unknown>
    afterOperation: () => Promise<unknown>
  }
}

export type ListConfiguration = {
  fields: {
    id: FieldConfiguration
    [key: string]: FieldConfiguration
  }
}

export type Configuration = {
  lists: {
    [key: string]: ListConfiguration
  }
}

export type Context = {} // TODO
