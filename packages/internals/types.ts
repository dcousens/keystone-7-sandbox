
export type Configuration = {
  lists: {
    [key: string]: {
      fields: {
        [key: string]: {
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
          graphql: {
          }
          hooks: {
            resolveInput: () => Promise<unknown>
            beforeOperation: () => Promise<unknown>
            afterOperation: () => Promise<unknown>
          }
        }
      }
    }
  }
}

export type FieldConfiguration = Configuration['lists'][string]['fields'][string]

export type Context = {
  graphql: {
    execute: () => Promise<void>
  }

  prisma: {

  }
}
