
export type Configuration = {
  lists: {
    [key: string]: {
      fields: {
        [key: string]: {
          db: {
            type: string
            null: boolean
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
