import type { FieldConfiguration } from './types'

export function id (): FieldConfiguration {
  return {
    prisma: {
      type: 'String',
      modifiers: {
        list: false,
        optional: false,
      },
      attributes: {
        id: true,
        default: null,
        map: null,
        unique: false
      },
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
        list: false,
        optional: true
      },
      attributes: {
        id: false,
        default: `""`,
        map: null,
        unique: false
      },
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
        list: false,
        optional: false
      },
      attributes: {
        id: false,
        default: `false`,
        map: null,
        unique: false
      },
    },
    hooks: {
      resolveInput: async () => console.error('resolveInput'),
      beforeOperation: async () => console.error('beforeOperation'),
      afterOperation: async () => console.error('afterOperation')
    }
  }
}

export function relationship ({
  ref,
  many
}: {
  ref: string,
  many?: boolean
}): FieldConfiguration {
  return {
    prisma: {
      type: {
        name: ref,
        fields: [],
        references: []
      },
      modifiers: {
        list: many ?? false,
        optional: false
      },
      attributes: {
        id: false,
        default: null,
        map: null,
        unique: false
      }
    },
    hooks: {
      resolveInput: async () => console.error('resolveInput'),
      beforeOperation: async () => console.error('beforeOperation'),
      afterOperation: async () => console.error('afterOperation')
    }
  }
}
