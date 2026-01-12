/**
 * TypeScript Types Example
 *
 * This example demonstrates type safety and TypeScript integration.
 */

import { createMask, MaskOptions, MaskResult } from '@oxog/mask';

const mask = createMask();

console.log('=== TypeScript Types Example ===\n');

// Define typed interfaces for masked data
interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  card?: string;
}

interface MaskedUserData {
  id: number;
  name: string;
  email: MaskResult;
  phone: MaskResult;
  card?: MaskResult;
}

// Typed masking function
function maskUser(user: UserData, options: MaskOptions): MaskedUserData {
  const masked = mask.mask(user, options);
  return masked as MaskedUserData;
}

// Usage with type safety
const user: UserData = {
  id: 123,
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1-555-123-4567',
  card: '4532015112830366',
};

console.log('--- Typed Masking ---\n');

const maskedUser = maskUser(user, {
  fields: {
    email: { strategy: 'middle' },
    phone: { last: 4 },
    card: { strategy: 'last:4', format: 'display' },
  },
});

console.log('Original:', user);
console.log('Masked:', maskedUser);

// Type guards for validation
function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && value.includes('@');
}

function isMaskedEmail(value: unknown): value is MaskResult {
  return typeof value === 'string' || typeof value === 'object';
}

// Generic masking function with type constraints
function maskData<T extends Record<string, any>>(
  data: T,
  fields: Record<keyof T, MaskOptions>
): { [K in keyof T]: T[K] extends string ? MaskResult | T[K] : T[K] } {
  return mask.mask(data, { fields }) as any;
}

// Type-safe field mapping
const fieldConfigs = {
  email: { strategy: 'middle' } as MaskOptions,
  phone: { strategy: 'last:4' } as MaskOptions,
  card: { strategy: 'full', format: 'compact' as const } as MaskOptions,
};

console.log('\n--- Generic Typed Masking ---\n');

const result = maskData(user, fieldConfigs);
console.log('Result:', result);

// Return type inference
const maskEmail = (email: string, strategy: 'middle' | 'full' | 'first'): MaskResult => {
  return mask.mask(email, { strategy }) as MaskResult;
};

const maskedEmail: MaskResult = maskEmail('test@example.com', 'middle');
console.log('\n--- Return Type Inference ---\n');
console.log('Masked email:', maskedEmail);

// Conditional types
type MaskedFields<T, K extends keyof T> = {
  [P in K]: T[P] extends string ? MaskResult : T[P];
};

type PartialMasked<T> = Omit<T, 'id'> & {
  email: MaskResult;
  phone: MaskResult;
};

const createMaskedUser = (user: UserData): PartialMasked<UserData> => {
  return mask.mask(user, {
    fields: {
      email: { strategy: 'middle' },
      phone: { strategy: 'last:4' },
    },
  }) as PartialMasked<UserData>;
};

console.log('\n--- Conditional Types ---\n');

const maskedUserPartial = createMaskedUser(user);
console.log('Partial masked user:', maskedUserPartial);

// Plugin type safety
type PluginConfig = {
  name: string;
  version: string;
  install: (kernel: any) => void;
};

function createCustomPlugin(config: PluginConfig): PluginConfig {
  return config;
}

// Type-safe plugin creation
const emailPlugin = createCustomPlugin({
  name: 'customEmail',
  version: '1.0.0',
  install: (kernel) => {
    kernel.registerMasker('customEmail', (value: string, options: MaskOptions = {}) => {
      return mask.mask(value, options);
    });
  },
});

console.log('\n--- Type-Safe Plugin ---\n');
console.log('Plugin name:', emailPlugin.name);

// Utility types
type MaskOptionsField = {
  strategy?: 'full' | 'middle' | 'first' | 'last';
  first?: number;
  last?: number;
  char?: string;
  format?: 'display' | 'compact' | 'log';
};

type MaskConfig<T> = {
  [K in keyof T]?: MaskOptionsField;
};

function applyMaskConfig<T extends Record<string, any>>(
  data: T,
  config: MaskConfig<T>
): T {
  return mask.mask(data, config) as T;
}

// Template literal types for strategies
type Strategy = 'full' | 'middle' | 'first' | 'last';
type Format = 'display' | 'compact' | 'log';

type StrategyOptions<S extends Strategy> = S extends 'first'
  ? { first: number }
  : S extends 'last'
  ? { last: number }
  : {};

type MaskOptionsWithStrategy<S extends Strategy> = {
  strategy: S;
} & StrategyOptions<S> & {
    char?: string;
    format?: Format;
  };

// Type-safe strategy application
function applyStrategy<S extends Strategy>(
  value: string,
  options: MaskOptionsWithStrategy<S>
): MaskResult {
  return mask.mask(value, options) as MaskResult;
}

console.log('\n--- Type-Safe Strategy Application ---\n');

const email1 = applyStrategy('test@example.com', { strategy: 'first', first: 2 });
const email2 = applyStrategy('test@example.com', { strategy: 'last', last: 3 });
const email3 = applyStrategy('test@example.com', { strategy: 'middle' });

console.log('First 2:', email1);
console.log('Last 3:', email2);
console.log('Middle:', email3);

// Array type handling
type MaskedArray<T> = T extends (infer U)[] ? MaskResult[] : never;

function maskArray<T extends string[]>(array: T): MaskedArray<T> {
  return array.map((item) => mask.mask(item, { strategy: 'middle' })) as any;
}

console.log('\n--- Array Type Handling ---\n');

const emails = ['a@example.com', 'b@example.com', 'c@example.com'];
const maskedEmails = maskArray(emails);
console.log('Masked emails:', maskedEmails);

// Deep type mapping
type DeepMasked<T> = T extends object
  ? { [K in keyof T]: DeepMasked<T[K]> }
  : T extends string
  ? MaskResult
  : T;

function deepMask<T>(obj: T): DeepMasked<T> {
  return mask.mask(obj, { format: 'log' }) as DeepMasked<T>;
}

console.log('\n--- Deep Type Mapping ---\n');

const nestedUser = {
  personal: {
    email: 'user@example.com',
    phone: '+1-555-123-4567',
  },
  payment: {
    card: '4532015112830366',
  },
};

const maskedNested = deepMask(nestedUser);
console.log('Masked nested:', maskedNested);

// Error handling with types
interface MaskingError {
  message: string;
  code: string;
  field?: string;
}

function safeMask<T>(
  data: T,
  options: MaskOptions
): { success: true; result: T } | { success: false; error: MaskingError } {
  try {
    const result = mask.mask(data, options);
    return { success: true, result: result as T };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: 'MASKING_ERROR',
      },
    };
  }
}

console.log('\n--- Type-Safe Error Handling ---\n');

const safeResult = safeMask(user, { fields: { email: { strategy: 'middle' } } });
if (safeResult.success) {
  console.log('Masked successfully:', safeResult.result);
} else {
  console.error('Masking failed:', safeResult.error);
}

// Final type verification
type IsString<T> = T extends string ? true : false;
type IsMaskResult<T> = T extends MaskResult ? true : false;

console.log('\n--- Type Verification ---\n');

const verifyTypes = () => {
  const email: string = 'test@example.com';
  const masked: MaskResult = mask.mask(email, { strategy: 'middle' }) as MaskResult;

  const emailIsString: IsString<typeof email> = true;
  const maskedIsMaskResult: IsMaskResult<typeof masked> = true;

  console.log('Email is string:', emailIsString);
  console.log('Masked is MaskResult:', maskedIsMaskResult);
};

verifyTypes();

// Output:
// --- Typed Masking ---
//
// Original: {...}
// Masked: {...}
//
// --- Generic Typed Masking ---
//
// Result: {...}
//
// --- Return Type Inference ---
//
// Masked email: t**t@e***.c*m
//
// --- Type-Safe Strategy Application ---
//
// First 2: te**@e***.c*m
// Last 3: t**t@e***.***m
// Middle: t**t@e***.c*m
//
// --- Array Type Handling ---
//
// Masked emails: [...]
//
// --- Deep Type Mapping ---
//
// Masked nested: {
//   personal: {
//     email: "[REDACTED:email]",
//     phone: "[REDACTED:phone]"
//   },
//   payment: {
//     card: "[REDACTED:card]"
//   }
// }
//
// --- Type-Safe Error Handling ---
//
// Masked successfully: {...}
//
// --- Type Verification ---
//
// Email is string: true
// Masked is MaskResult: true
