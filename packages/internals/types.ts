export type FieldConfiguration = {
  graphql: {
  }
  prisma: {
    type: 'Boolean' | 'DateTime' | 'Int' | 'String'
    modifiers: {
      optional: boolean
      array?: boolean
    },
    attributes: {
      id?: boolean,
      default?: string
      map?: string
      relation?: {
        name: string,
        fields: string[],
        references: string[]
      }
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
  } & Partial<{
    [key: string]: FieldConfiguration
  }>
}

export type Configuration = {
  lists: {
    [key: string]: ListConfiguration
  }
}

export type Context = {} // TODO
