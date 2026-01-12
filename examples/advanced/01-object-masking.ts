/**
 * Object Masking Example
 *
 * This example demonstrates masking entire objects with selective field masking.
 */

import { createMask } from '@oxog/mask';

const mask = createMask();
mask.use(require('@oxog/mask/plugins/core/email').email());
mask.use(require('@oxog/mask/plugins/core/phone').phone());
mask.use(require('@oxog/mask/plugins/core/card').card());

console.log('=== Object Masking ===\n');

// User object with sensitive data
const user = {
  id: 12345,
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1-555-123-4567',
  card: '4532015112830366',
  address: '123 Main St',
  createdAt: '2024-01-15',
};

// Mask specific fields
const maskedUser = mask.mask(user, {
  fields: {
    email: { strategy: 'middle' },
    phone: { strategy: 'last:4' },
    card: { strategy: 'last:4' },
  },
});

console.log('Original:', JSON.stringify(user, null, 2));
console.log('\nMasked:', JSON.stringify(maskedUser, null, 2));

// Output:
// Original: {
//   "id": 12345,
//   "name": "John Doe",
//   "email": "john.doe@example.com",
//   "phone": "+1-555-123-4567",
//   "card": "4532015112830366",
//   "address": "123 Main St",
//   "createdAt": "2024-01-15"
// }
//
// Masked: {
//   "id": 12345,
//   "name": "John Doe",
//   "email": "j***n.***@e***e.com",
//   "phone": "+1-555-123-****",
//   "card": "************0366",
//   "address": "123 Main St",
//   "createdAt": "2024-01-15"
// }
