/**
 * API Response Masking Example
 *
 * This example demonstrates masking API responses for different use cases.
 */

import { createMask } from '@oxog/mask';

const mask = createMask();
mask.use(require('@oxog/mask/plugins/core/email').email());
mask.use(require('@oxog/mask/plugins/core/phone').phone());
mask.use(require('@oxog/mask/plugins/core/card').card());

console.log('=== API Response Masking ===\n');

// Simulated API responses
const userProfile = {
  id: 12345,
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1-555-123-4567',
  createdAt: '2024-01-01',
};

// Public API response (minimal masking)
const publicProfile = mask.mask(userProfile, {
  fields: {
    email: { strategy: 'first:1', last: 3 },
    phone: { strategy: 'first:3' },
  },
});

console.log('--- Public Profile API ---\n');
console.log(JSON.stringify(publicProfile, null, 2));

// Admin API response (detailed masking)
const adminProfile = mask.mask(userProfile, {
  fields: {
    email: { strategy: 'middle' },
    phone: { strategy: 'last:4' },
  },
});

console.log('\n--- Admin Profile API ---\n');
console.log(JSON.stringify(adminProfile, null, 2));

// Audit log API (full redaction)
const auditProfile = mask.mask(userProfile, {
  format: 'log',
});

console.log('\n--- Audit Log API ---\n');
console.log(JSON.stringify(auditProfile, null, 2));

// Payment info response
const paymentInfo = {
  id: 'PAY-123',
  userId: 12345,
  cardNumber: '4532015112830366',
  cardHolder: 'John Doe',
  amount: 99.99,
  status: 'completed',
};

console.log('\n--- Payment Response (Admin) ---\n');
console.log(JSON.stringify(
  mask.mask(paymentInfo, {
    fields: {
      cardNumber: { strategy: 'last:4', format: 'display' },
    },
  }),
  null, 2
));

console.log('\n--- Payment Response (User) ---\n');
console.log(JSON.stringify(
  mask.mask(paymentInfo, {
    fields: {
      cardNumber: { strategy: 'full', format: 'compact' },
      userId: { strategy: 'full' },
    },
  }),
  null, 2
));

// Response with conditional masking
const conditionalMask = (data: any, isPublic: boolean) => {
  if (isPublic) {
    return mask.mask(data, {
      fields: {
        email: { strategy: 'first:1', last: 3 },
        phone: { strategy: 'first:3' },
      },
    });
  } else {
    return mask.mask(data, {
      fields: {
        email: { strategy: 'middle' },
        phone: { strategy: 'last:4' },
      },
    });
  }
};

console.log('\n--- Conditional Response ---\n');
console.log('Public:', JSON.stringify(conditionalMask(userProfile, true), null, 2));
console.log('\nPrivate:', JSON.stringify(conditionalMask(userProfile, false), null, 2));

// Output:
// --- Public Profile API ---
//
// {
//   "id": 12345,
//   "name": "John Doe",
//   "email": "j***@e***.com",
//   "phone": "+1-***",
//   "createdAt": "2024-01-01"
// }
//
// --- Admin Profile API ---
//
// {
//   "id": 12345,
//   "name": "John Doe",
//   "email": "j***n.***@e***e.com",
//   "phone": "+1-555-123-****",
//   "createdAt": "2024-01-01"
// }
//
// --- Audit Log API ---
//
// {
//   "id": 12345,
//   "name": "John Doe",
//   "email": "[REDACTED:email]",
//   "phone": "[REDACTED:phone]",
//   "createdAt": "2024-01-01"
// }
//
// --- Payment Response (Admin) ---
//
// {
//   "id": "PAY-123",
//   "userId": 12345,
//   "cardNumber": "**** **** **** 0366",
//   "cardHolder": "John Doe",
//   "amount": 99.99,
//   "status": "completed"
// }
//
// --- Payment Response (User) ---
//
// {
//   "id": "PAY-123",
//   "userId": "********",
//   "cardNumber": "****************",
//   "cardHolder": "John Doe",
//   "amount": 99.99,
//   "status": "completed"
// }
//
// --- Conditional Response ---
//
// Public: {
//   "id": 12345,
//   "name": "John Doe",
//   "email": "j***@e***.com",
//   "phone": "+1-***",
//   "createdAt": "2024-01-01"
// }
//
// Private: {
//   "id": 12345,
//   "name": "John Doe",
//   "email": "j***n.***@e***e.com",
//   "phone": "+1-555-123-****",
//   "createdAt": "2024-01-01"
// }
