type ConfigurationType = {
  lists: {
    [key: string]: {
      fields: {
        [key: string]: {
          db: {
            type: string,
            null: boolean
          },
          graphql: {
          }
        }
      }
    }
  }
}

export function setup (config: ConfigurationType) {
  return true
}
