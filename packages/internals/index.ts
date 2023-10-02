import type { Configuration, Context } from './types'

export function setup (config: Configuration): Context {
  return {
    graphql: {
      execute: async () => {

      }
    },

    prisma: {

    },
  }
}
