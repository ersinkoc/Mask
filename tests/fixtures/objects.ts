/**
 * Test fixtures for object testing
 */

export const simpleObject = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
};

export const nestedObject = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  address: {
    street: '123 Main St',
    city: 'Anytown',
    zip: '12345',
    creditCard: '4532015112830366',
  },
  payment: {
    cardNumber: '5555555555554444',
    iban: 'TR330006100519786457841326',
  },
};

export const arrayObject = {
  users: [
    {
      name: 'John Doe',
      email: 'john@example.com',
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
  ],
};

export const deepNestedObject = {
  level1: {
    level2: {
      level3: {
        level4: {
          email: 'deep@example.com',
          phone: '+1234567890',
        },
      },
    },
  },
};

export const mixedTypesObject = {
  name: 'John Doe',
  age: 30,
  email: 'john@example.com',
  isActive: true,
  scores: [85, 90, 78],
  address: {
    street: '123 Main St',
    city: 'Anytown',
    zip: '12345',
  },
  metadata: {
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
  },
};

export const circularObject = {
  name: 'John Doe',
  email: 'john@example.com',
} as any;

(circularObject as any).self = circularObject;

export const emptyObject = {};

export const emptyArray: any[] = [];

export const objectWithUndefined = {
  name: 'John Doe',
  email: undefined,
  phone: null,
};

export const objectWithEmptyString = {
  name: 'John Doe',
  email: '',
  phone: '+1234567890',
};

export const objectMaskingTestCases = [
  {
    name: 'Simple object',
    input: simpleObject,
    fields: {
      email: 'email',
      phone: 'phone',
    },
    expected: {
      name: 'John Doe',
      email: 'j***n@e***.com',
      phone: '+12***7890',
    },
  },
  {
    name: 'Nested object',
    input: nestedObject,
    fields: {
      email: 'email',
      phone: 'phone',
      'address.creditCard': 'card',
      'payment.cardNumber': 'card',
    },
    expected: {
      name: 'John Doe',
      email: 'j***n@e***.com',
      phone: '+12***7890',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        zip: '12345',
        creditCard: '**** **** **** 0366',
      },
      payment: {
        cardNumber: '**** **** **** 4444',
        iban: 'TR330006100519786457841326',
      },
    },
  },
  {
    name: 'Array object',
    input: arrayObject,
    fields: {
      email: 'email',
    },
    expected: {
      users: [
        {
          name: 'John Doe',
          email: 'j***n@e***.com',
        },
        {
          name: 'Jane Smith',
          email: 'j***e@e***.com',
        },
      ],
    },
  },
];

export const fieldPaths = [
  'email',
  'phone',
  'address.street',
  'payment.cardNumber',
  'users.0.email',
  'level1.level2.level3.email',
];

export const invalidFieldPaths = [
  '',
  '.email',
  'email.',
  'user..email',
  'user@email',
  'user.email.',
];

export const strategies = [
  'full',
  'middle',
  'first:2',
  'last:4',
  'partial:0.5',
];

export const formats = ['display', 'compact', 'log'] as const;
