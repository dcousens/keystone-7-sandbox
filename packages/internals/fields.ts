import type { FieldConfiguration } from './types'

export function id (): FieldConfiguration {
  return {
    prisma: {
      type: 'String',
      modifiers: {
        optional: false,
        array: false
      },
      attributes: {
        id: true
      },
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
    prisma: {
      type: 'String',
      modifiers: {
        optional: true
      },
      attributes: {
        default: `""`
      },
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

export function checkbox (): FieldConfiguration {
  return {
    prisma: {
      type: 'Boolean',
      modifiers: {
        optional: false
      },
      attributes: {
        default: `false`
      },
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
