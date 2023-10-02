export type FieldConfiguration = {
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

export type Context = {}
