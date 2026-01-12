/**
 * Configuration Example
 *
 * This example demonstrates different configuration approaches and presets.
 */

import { createMask } from '@oxog/mask';

const mask = createMask();
mask.use(require('@oxog/mask/plugins/core/email').email());
mask.use(require('@oxog/mask/plugins/core/phone').phone());
mask.use(require('@oxog/mask/plugins/core/card').card());

console.log('=== Configuration Example ===\n');

// Predefined configuration presets
const ConfigPresets = {
  // Minimal masking for public APIs
  public: {
    email: { strategy: 'first:1', last: 3 },
    phone: { strategy: 'first:3' },
    card: { strategy: 'full', format: 'compact' },
  },

  // Standard masking for internal use
  standard: {
    email: { strategy: 'middle', format: 'compact' },
    phone: { strategy: 'last:4', format: 'compact' },
    card: { strategy: 'last:4', format: 'display' },
  },

  // Strict masking for sensitive data
  strict: {
    email: { strategy: 'middle' },
    phone: { strategy: 'last:4' },
    card: { strategy: 'middle' },
  },

  // Full redaction for logs
  audit: {
    format: 'log',
  },
};

// Apply configuration
const applyConfig = (data: any, presetName: string) => {
  const preset = ConfigPresets[presetName as keyof typeof ConfigPresets];
  if (!preset) {
    throw new Error(`Unknown preset: ${presetName}`);
  }

  return mask.mask(data, preset);
};

// Test with different presets
const testData = {
  email: 'john.doe@example.com',
  phone: '+1-555-123-4567',
  card: '4532015112830366',
};

console.log('--- Configuration Presets ---\n');

Object.keys(ConfigPresets).forEach((presetName) => {
  console.log(`${presetName.toUpperCase()}:`);
  const result = applyConfig(testData, presetName);
  console.log(JSON.stringify(result, null, 2));
  console.log('');
});

// Environment-specific configurations
const configs = {
  development: {
    ...ConfigPresets.standard,
    // Development might have less strict masking for debugging
    char: '•',
  },

  staging: {
    ...ConfigPresets.strict,
    char: '*',
  },

  production: {
    ...ConfigPresets.audit,
    // Production uses most secure settings
    format: 'log',
  },
};

console.log('--- Environment Configurations ---\n');

Object.entries(configs).forEach(([env, config]) => {
  console.log(`${env.toUpperCase()}:`);
  const result = mask.mask(testData, config);
  console.log(JSON.stringify(result, null, 2));
  console.log('');
});

// Custom configuration builder
const createMaskingConfig = (options: {
  email?: any;
  phone?: any;
  card?: any;
  defaultChar?: string;
  defaultFormat?: string;
}) => {
  const config: any = {};

  if (options.email) config.email = options.email;
  if (options.phone) config.phone = options.phone;
  if (options.card) config.card = options.card;
  if (options.defaultChar) config.char = options.defaultChar;
  if (options.defaultFormat) config.format = options.defaultFormat;

  return config;
};

// Build custom configurations
const configs_custom = {
  // Mask all with custom character
  diamond: createMaskingConfig({
    defaultChar: '◆',
    email: { strategy: 'middle' },
    phone: { strategy: 'last:4' },
    card: { strategy: 'full', format: 'compact' },
  }),

  // Mask with numbers for credit cards only
  numbers: createMaskingConfig({
    defaultChar: 'X',
    card: { strategy: 'last:4', format: 'display' },
  }),

  // Custom email masking
  customEmail: createMaskingConfig({
    email: { strategy: 'first:2' },
    char: '#',
  }),
};

console.log('--- Custom Configurations ---\n');

Object.entries(configs_custom).forEach(([name, config]) => {
  console.log(`${name.toUpperCase()}:`);
  const result = mask.mask(testData, config);
  console.log(JSON.stringify(result, null, 2));
  console.log('');
});

// Dynamic configuration based on user role
const getConfigForRole = (role: 'admin' | 'user' | 'guest') => {
  switch (role) {
    case 'admin':
      return {
        email: { strategy: 'middle', format: 'compact' },
        phone: { strategy: 'last:4', format: 'compact' },
        card: { strategy: 'last:4', format: 'display' },
      };

    case 'user':
      return {
        email: { strategy: 'first:1', last: 3 },
        phone: { strategy: 'first:3' },
        card: { strategy: 'full', format: 'compact' },
      };

    case 'guest':
      return {
        format: 'log',
      };

    default:
      return ConfigPresets.public;
  }
};

console.log('--- Role-Based Configuration ---\n');

const userData = {
  email: 'test@example.com',
  phone: '+1-555-123-4567',
  card: '4532015112830366',
};

['admin', 'user', 'guest'].forEach((role) => {
  console.log(`${role.toUpperCase()} view:`);
  const config = getConfigForRole(role as any);
  const result = mask.mask(userData, config);
  console.log(JSON.stringify(result, null, 2));
  console.log('');
});

// Configuration validation
const validateConfig = (config: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check if valid format
  if (config.format && !['display', 'compact', 'log'].includes(config.format)) {
    errors.push(`Invalid format: ${config.format}`);
  }

  // Check if valid char
  if (config.char && config.char.length !== 1) {
    errors.push('Char must be a single character');
  }

  // Check strategy formats
  const strategies = ['full', 'middle', 'first', 'last'];
  Object.entries(config).forEach(([key, value]: [string, any]) => {
    if (value && typeof value === 'object' && value.strategy) {
      if (!strategies.includes(value.strategy)) {
        errors.push(`Invalid strategy for ${key}: ${value.strategy}`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Test configuration validation
console.log('--- Configuration Validation ---\n');

const testConfigs = [
  { name: 'Valid', config: { email: { strategy: 'middle' }, char: '*' } },
  { name: 'Invalid format', config: { email: { strategy: 'middle' }, format: 'invalid' } },
  { name: 'Invalid char', config: { email: { strategy: 'middle' }, char: '**' } },
  { name: 'Invalid strategy', config: { email: { strategy: 'invalid' } } },
];

testConfigs.forEach(({ name, config }) => {
  const result = validateConfig(config);
  console.log(`${name}: ${result.valid ? '✓ Valid' : '✗ Invalid'}`);
  if (!result.valid) {
    result.errors.forEach((err) => console.log(`  - ${err}`));
  }
});

// Configuration inheritance
const baseConfig = {
  char: '*',
  format: 'display' as const,
};

const extendedConfig = {
  ...baseConfig,
  email: { strategy: 'middle' },
};

const mergedConfig = {
  ...baseConfig,
  ...extendedConfig,
};

console.log('\n--- Configuration Inheritance ---\n');

console.log('Base config:', JSON.stringify(baseConfig, null, 2));
console.log('Extended config:', JSON.stringify(extendedConfig, null, 2));
console.log('Merged config:', JSON.stringify(mergedConfig, null, 2));

// Real-world scenario: Multi-tenant configuration
console.log('\n--- Multi-Tenant Configuration ---\n');

const tenantConfigs = {
  tenantA: {
    ...ConfigPresets.strict,
    char: '•',
  },
  tenantB: {
    ...ConfigPresets.standard,
    char: '#',
  },
  tenantC: {
    ...ConfigPresets.audit,
  },
};

const getTenantData = (tenantId: string, userId: number) => {
  return {
    email: `user${userId}@${tenantId}.com`,
    phone: '+1-555-123-4567',
    card: '4532015112830366',
  };
};

['tenantA', 'tenantB', 'tenantC'].forEach((tenant) => {
  const config = tenantConfigs[tenant as keyof typeof tenantConfigs];
  const data = getTenantData(tenant, 123);
  const masked = mask.mask(data, config);

  console.log(`${tenant.toUpperCase()}:`);
  console.log(JSON.stringify(masked, null, 2));
  console.log('');
});

// Output:
// --- Configuration Presets ---
//
// PUBLIC: {...}
// STANDARD: {...}
// STRICT: {...}
// AUDIT: {...}
//
// --- Environment Configurations ---
//
// DEVELOPMENT: {...}
// STAGING: {...}
// PRODUCTION: {...}
//
// --- Custom Configurations ---
//
// DIAMOND: {...}
// NUMBERS: {...}
// CUSTOMEMAIL: {...}
//
// --- Role-Based Configuration ---
//
// ADMIN: {...}
// USER: {...}
// GUEST: {...}
//
// --- Configuration Validation ---
//
// Valid: ✓ Valid
// Invalid format: ✗ Invalid
// Invalid char: ✗ Invalid
// Invalid strategy: ✗ Invalid
//
// --- Configuration Inheritance ---
//
// Base config: {...}
// Extended config: {...}
// Merged config: {...}
//
// --- Multi-Tenant Configuration ---
//
// TENANTA: {...}
// TENANTB: {...}
// TENANTC: {...}
