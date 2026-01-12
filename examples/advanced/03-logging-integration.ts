/**
 * Logging Integration Example
 *
 * This example demonstrates integrating masking with logging systems.
 */

import { createMask } from '@oxog/mask';

const mask = createMask();
mask.use(require('@oxog/mask/plugins/core/email').email());
mask.use(require('@oxog/mask/plugins/core/phone').phone());
mask.use(require('@oxog/mask/plugins/core/card').card());

// Simulated logger
const logger = {
  info: (message: string, data?: any) => {
    const maskedData = data ? mask.mask(data, { format: 'log' }) : data;
    console.log(`[INFO] ${message}`, maskedData);
  },
  error: (message: string, data?: any) => {
    const maskedData = data ? mask.mask(data, { format: 'log' }) : data;
    console.log(`[ERROR] ${message}`, maskedData);
  },
};

console.log('=== Logging Integration ===\n');

// Simulate a login event
logger.info('User login', {
  userId: 12345,
  email: 'john.doe@example.com',
  ipAddress: '192.168.1.100',
});

// Simulate a payment event
logger.info('Payment processed', {
  transactionId: 'TXN-789456',
  cardNumber: '4532015112830366',
  amount: 99.99,
  customerEmail: 'jane.smith@company.com',
});

// Simulate an error with sensitive data
logger.error('API call failed', {
  endpoint: '/api/payment',
  email: 'test.user@example.com',
  phone: '+1-555-123-4567',
  errorCode: 'AUTH_FAILED',
});

// Custom log format
const logWithContext = (level: string, message: string, context: any) => {
  const maskedContext = mask.mask(context, { format: 'log' });
  console.log(`[${level}] ${message}`, maskedContext);
};

console.log('\n=== Custom Log Format ===\n');

logWithContext('DEBUG', 'Processing request', {
  userEmail: 'admin@example.com',
  requestId: 'REQ-123-456',
});

logWithContext('WARN', 'Suspicious activity', {
  ip: '10.0.0.1',
  email: 'hack@evil.com',
  attempts: 5,
});

// Output:
// === Logging Integration ===
//
// [INFO] User login [REDACTED:email]
// [ERROR] Payment processed [REDACTED:card]
// [ERROR] API call failed [REDACTED:email]
//
// === Custom Log Format ===
//
// [DEBUG] Processing request [REDACTED:email]
// [WARN] Suspicious activity [REDACTED:email]
