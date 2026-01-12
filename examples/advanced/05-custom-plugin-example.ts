/**
 * Custom Plugin Example
 *
 * This example demonstrates creating a custom plugin for specialized data masking.
 */

import { createMask } from '@oxog/mask';

console.log('=== Custom Plugin Example ===\n');

// Custom plugin: Driver's License masking
const createDriverLicensePlugin = () => {
  return {
    name: 'driverLicense',
    version: '1.0.0',
    install(kernel: any) {
      kernel.registerMasker('driverLicense', (value: string, options: any = {}) => {
        const { strategy = 'middle', char = '*' } = options;

        // Remove any non-alphanumeric characters
        const clean = value.replace(/[^a-zA-Z0-9]/g, '');

        if (clean.length === 0) {
          return value;
        }

        let result = '';

        switch (strategy) {
          case 'full':
            result = char.repeat(clean.length);
            break;

          case 'first':
            const firstN = parseInt(options.first?.toString() || '0', 10);
            result = clean.substring(0, firstN) + char.repeat(clean.length - firstN);
            break;

          case 'last':
            const lastN = parseInt(options.last?.toString() || '0', 10);
            result = char.repeat(clean.length - lastN) + clean.substring(clean.length - lastN);
            break;

          case 'middle':
          default:
            const start = Math.floor(clean.length * 0.25);
            const end = Math.floor(clean.length * 0.75);
            result = clean.substring(0, start) + char.repeat(end - start) + clean.substring(end);
            break;
        }

        // Re-apply original formatting
        let resultIndex = 0;
        let formatted = '';

        for (const char of value) {
          if (/[a-zA-Z0-9]/.test(char)) {
            formatted += result[resultIndex++] || '*';
          } else {
            formatted += char;
          }
        }

        return formatted;
      });
    },
  };
};

// Custom plugin: Passport number masking
const createPassportPlugin = () => {
  return {
    name: 'passport',
    version: '1.0.0',
    install(kernel: any) {
      kernel.registerMasker('passport', (value: string, options: any = {}) => {
        const { char = '*' } = options;

        // Format: 2 letters + 6 digits
        const match = value.match(/^([A-Z]{2})(\d{6})$/);
        if (!match) {
          return value;
        }

        const [, letters, digits] = match;
        return letters + char.repeat(6);
      });
    },
  };
};

const mask = createMask();

// Install custom plugins
mask.use(createDriverLicensePlugin());
mask.use(createPassportPlugin());

console.log('--- Driver License Masking ---\n');

const licenses = [
  'ABC123456789',
  'XYZ987654321',
  'DL-555-888-999',
];

licenses.forEach(license => {
  console.log(`Original: ${license}`);
  console.log(`Middle:   ${mask.driverLicense(license)}`);
  console.log(`First 3:  ${mask.driverLicense(license, { strategy: 'first', first: 3 })}`);
  console.log(`Last 4:   ${mask.driverLicense(license, { strategy: 'last', last: 4 })}`);
  console.log(`Full:     ${mask.driverLicense(license, { strategy: 'full' })}`);
  console.log('');
});

console.log('--- Passport Masking ---\n');

const passports = [
  'US123456',
  'UK987654',
  'CA456789',
];

passports.forEach(passport => {
  console.log(`Original: ${passport}`);
  console.log(`Masked:   ${mask.passport(passport)}`);
  console.log('');
});

// Object masking with custom plugins
console.log('--- Object with Custom Types ---\n');

const travelDocument = {
  name: 'John Doe',
  driverLicense: 'ABC123456789',
  passport: 'US123456',
  email: 'john.doe@example.com',
};

console.log('Original:', JSON.stringify(travelDocument, null, 2));

const maskedDoc = mask.mask(travelDocument, {
  fields: {
    driverLicense: { strategy: 'first', first: 3 },
    passport: {},
    email: { strategy: 'middle' },
  },
});

console.log('\nMasked:', JSON.stringify(maskedDoc, null, 2));

// More advanced custom plugin: Bank Account with routing number
const createBankAccountPlugin = () => {
  return {
    name: 'bankAccount',
    version: '1.0.0',
    install(kernel: any) {
      kernel.registerMasker('bankAccount', (value: string, options: any = {}) => {
        const { char = '*' } = options;

        // Format: XXXXXXXX (8 digits for checking account)
        const match = value.match(/^(\d{4})(\d{4})$/);
        if (!match) {
          return value;
        }

        const [, first4, last4] = match;
        return first4 + char.repeat(4);
      });
    },
  };
};

mask.use(createBankAccountPlugin());

console.log('\n--- Bank Account Masking ---\n');

const accounts = [
  '12345678',
  '87654321',
];

accounts.forEach(account => {
  console.log(`Account: ${account} → ${mask.bankAccount(account)}`);
});

// Complex scenario: Travel booking with multiple custom types
console.log('\n--- Complex Scenario: Travel Booking ---\n');

const booking = {
  id: 'BK-123456',
  passenger: {
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+1-555-987-6543',
    passport: 'UK987654',
    driverLicense: 'XYZ987654321',
  },
  payment: {
    cardNumber: '4532015112830366',
    bankAccount: '12345678',
  },
  emergencyContact: {
    name: 'John Smith',
    phone: '+1-555-123-4567',
    email: 'john.smith@email.com',
  },
};

console.log('Full booking data (admin):');
const adminView = mask.mask(booking, {
  fields: {
    'passenger.email': { strategy: 'middle' },
    'passenger.phone': { strategy: 'last:4' },
    'passenger.passport': {},
    'passenger.driverLicense': { strategy: 'first', first: 3 },
    'payment.cardNumber': { strategy: 'last:4', format: 'display' },
    'payment.bankAccount': {},
    'emergencyContact.email': { strategy: 'middle' },
    'emergencyContact.phone': { strategy: 'last:4' },
  },
});
console.log(JSON.stringify(adminView, null, 2));

console.log('\nPublic view (minimal data):');
const publicView = mask.mask(booking, {
  fields: {
    'passenger.email': { strategy: 'first:1', last: 3 },
    'passenger.phone': { strategy: 'first:3' },
    'passenger.passport': {},
    'passenger.driverLicense': { strategy: 'full' },
    'payment.cardNumber': { strategy: 'full', format: 'compact' },
    'payment.bankAccount': {},
    'emergencyContact.email': { strategy: 'first:1', last: 3 },
    'emergencyContact.phone': { strategy: 'first:3' },
  },
});
console.log(JSON.stringify(publicView, null, 2));

// Output:
// --- Driver License Masking ---
//
// Original: ABC123456789
// Middle:   ABC******789
// First 3:  ABC******
// Last 4:   ******789
// Full:     ***********
//
// --- Passport Masking ---
//
// Original: US123456
// Masked:   US******
//
// --- Object with Custom Types ---
//
// Original: {
//   "name": "John Doe",
//   "driverLicense": "ABC123456789",
//   "passport": "US123456",
//   "email": "john.doe@example.com"
// }
//
// Masked: {
//   "name": "John Doe",
//   "driverLicense": "ABC******",
//   "passport": "US******",
//   "email": "j***n.***@e***e.com"
// }
//
// --- Bank Account Masking ---
//
// Account: 12345678 → 1234****
//
// --- Complex Scenario: Travel Booking ---
//
// Full booking data (admin): {...}
//
// Public view (minimal data): {...}
