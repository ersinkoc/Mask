/**
 * Database Integration Example
 *
 * This example demonstrates masking data before storing in database.
 */

import { createMask } from '@oxog/mask';

const mask = createMask();
mask.use(require('@oxog/mask/plugins/core/email').email());
mask.use(require('@oxog/mask/plugins/core/phone').phone());
mask.use(require('@oxog/mask/plugins/core/card').card());

console.log('=== Database Integration ===\n');

// Simulated database save function
const saveUser = async (userData: any) => {
  // Mask sensitive fields before saving
  const maskedData = mask.mask(userData, {
    fields: {
      email: { strategy: 'middle', format: 'compact' },
      phone: { strategy: 'last:4', format: 'compact' },
      card: { strategy: 'full', format: 'compact' },
    },
  });

  console.log('Saving to database:', JSON.stringify(maskedData, null, 2));
  return maskedData;
};

// Simulated audit log
const createAuditLog = (action: string, data: any) => {
  const auditData = {
    timestamp: new Date().toISOString(),
    action,
    data: mask.mask(data, { format: 'log' }),
  };

  console.log('\nAudit log entry:', JSON.stringify(auditData, null, 2));
};

console.log('--- User Registration ---\n');
saveUser({
  id: 12345,
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1-555-123-4567',
  card: '4532015112830366',
  address: '123 Main St',
});

createAuditLog('USER_REGISTER', {
  email: 'john.doe@example.com',
  ip: '192.168.1.100',
});

console.log('\n--- Payment Setup ---\n');
saveUser({
  userId: 12345,
  cardNumber: '5555-5555-5555-4444',
  expiryDate: '12/25',
  cvv: '123',
});

createAuditLog('PAYMENT_METHOD_ADDED', {
  userId: 12345,
  cardLast4: '4444',
});

// Query result masking
const queryUsers = () => {
  const results = [
    {
      id: 1,
      name: 'Alice',
      email: 'alice@example.com',
      phone: '+1-555-111-2222',
    },
    {
      id: 2,
      name: 'Bob',
      email: 'bob@company.org',
      phone: '+1-555-333-4444',
    },
  ];

  console.log('\n--- Query Results ---\n');
  console.log('Original query result:');
  console.log(JSON.stringify(results, null, 2));

  const maskedResults = results.map((user) =>
    mask.mask(user, {
      fields: {
        email: { strategy: 'middle', format: 'compact' },
        phone: { strategy: 'last:4', format: 'compact' },
      },
    })
  );

  console.log('\nMasked query result:');
  console.log(JSON.stringify(maskedResults, null, 2));
};

queryUsers();

// Output:
// --- User Registration ---
//
// Saving to database: {
//   "id": 12345,
//   "name": "John Doe",
//   "email": "j***n.***@e***e.com",
//   "phone": "+1-555-123-****",
//   "card": "****************",
//   "address": "123 Main St"
// }
//
// Audit log entry: {
//   "timestamp": "2024-01-15T10:30:00.000Z",
//   "action": "USER_REGISTER",
//   "data": "[REDACTED:email]"
// }
//
// --- Payment Setup ---
//
// Saving to database: {
//   "userId": 12345,
//   "cardNumber": "****************",
//   "expiryDate": "12/25",
//   "cvv": "123"
// }
//
// Audit log entry: {
//   "timestamp": "2024-01-15T10:30:00.000Z",
//   "action": "PAYMENT_METHOD_ADDED",
//   "data": "[REDACTED:card]"
// }
//
// --- Query Results ---
//
// Original query result: [...]
// Masked query result: [...]
