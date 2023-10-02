import type { FieldConfiguration } from './types'

export function id (): FieldConfiguration {
  return {
    db: {
      type: 'String',
      null: false
    },
    graphql: {
    },
    hooks: {
      resolveInput: async () => console.error('resolveInput'),
      beforeOperation: async () => console.error('beforeOperation'),
      afterOperation: async () => console.error('afterOperation')
    }
  }
}

export function text (): FieldConfiguration {
  return {
    db: {
      type: 'String',
      null: false
    },
    graphql: {
    },
    hooks: {
      resolveInput: async () => console.error('resolveInput'),
      beforeOperation: async () => console.error('beforeOperation'),
      afterOperation: async () => console.error('afterOperation')
    }
  }
}
