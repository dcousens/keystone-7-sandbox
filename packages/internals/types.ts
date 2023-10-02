type __FieldConfiguration = {
  graphql: {
  }
  prisma: {
    type: 'Int' | 'String'
    modifiers: {
      optional?: boolean
      array?: boolean
    },
    attributes: {
      id?: boolean,
      default?: string
    },
  }
  hooks: {
    resolveInput: () => Promise<unknown>
    beforeOperation: () => Promise<unknown>
    afterOperation: () => Promise<unknown>
  }
}

export type Configuration = {
  lists: {
    [key: string]: {
      fields: {
        id: __FieldConfiguration
      } & Partial<{
        [key: string]: __FieldConfiguration
      }>
    }
  }
}

export type ListConfiguration = Configuration['lists'][string]
export type FieldConfiguration = Configuration['lists'][string]['fields'][string]
export type Context = {}
