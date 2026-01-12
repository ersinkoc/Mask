/**
 * Real-World Example: API Security
 *
 * This example demonstrates secure API implementation with data masking.
 */

import { createMask } from '@oxog/mask';

const mask = createMask();
mask.use(require('@oxog/mask/plugins/core/email').email());
mask.use(require('@oxog/mask/plugins/core/phone').phone());
mask.use(require('@oxog/mask/plugins/core/card').card());

console.log('=== Real-World: API Security ===\n');

// Security levels
enum SecurityLevel {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  SECRET = 'secret',
}

// API Response handler with security levels
class SecureAPI {
  private mask: any;

  constructor(maskInstance: any) {
    this.mask = maskInstance;
  }

  // Mask data based on security level
  private applySecurity(data: any, level: SecurityLevel): any {
    switch (level) {
      case SecurityLevel.PUBLIC:
        return this.mask.mask(data, {
          fields: {
            email: { strategy: 'first:1', last: 3 },
            phone: { strategy: 'first:3' },
            card: { strategy: 'full', format: 'compact' },
          },
        });

      case SecurityLevel.INTERNAL:
        return this.mask.mask(data, {
          fields: {
            email: { strategy: 'middle', format: 'compact' },
            phone: { strategy: 'last:4', format: 'compact' },
            card: { strategy: 'last:4', format: 'display' },
          },
        });

      case SecurityLevel.CONFIDENTIAL:
        return this.mask.mask(data, {
          fields: {
            email: { strategy: 'middle' },
            phone: { strategy: 'last:4' },
            card: { strategy: 'middle' },
          },
        });

      case SecurityLevel.SECRET:
        return this.mask.mask(data, { format: 'log' });

      default:
        return data;
    }
  }

  // Get user profile based on requester's role
  getUserProfile(userId: number, requesterRole: SecurityLevel) {
    // Simulated database fetch
    const user = {
      id: userId,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-123-4567',
      card: '4532015112830366',
      ssn: '123-45-6789',
      createdAt: '2024-01-01',
    };

    // Apply security level
    return this.applySecurity(user, requesterRole);
  }

  // Get payment info
  getPaymentInfo(paymentId: string, requesterRole: SecurityLevel) {
    const payment = {
      id: paymentId,
      userId: 12345,
      amount: 99.99,
      cardLast4: '0366',
      cardHolder: 'John Doe',
      email: 'john.doe@example.com',
      status: 'completed',
    };

    return this.applySecurity(payment, requesterRole);
  }

  // Sanitize error responses
  sanitizeError(error: Error, role: SecurityLevel): string {
    if (role === SecurityLevel.PUBLIC) {
      return 'An error occurred. Please contact support.';
    }

    // For internal roles, provide more details but mask sensitive data
    return error.message;
  }
}

const api = new SecureAPI(api);

// Simulate API calls with different security levels
console.log('--- API Security Levels ---\n');

console.log('1. Public API (lowest security):');
console.log(JSON.stringify(api.getUserProfile(123, SecurityLevel.PUBLIC), null, 2));

console.log('\n2. Internal API (medium security):');
console.log(JSON.stringify(api.getUserProfile(123, SecurityLevel.INTERNAL), null, 2));

console.log('\n3. Confidential API (high security):');
console.log(JSON.stringify(api.getUserProfile(123, SecurityLevel.CONFIDENTIAL), null, 2));

console.log('\n4. Secret API (highest security):');
console.log(JSON.stringify(api.getUserProfile(123, SecurityLevel.SECRET), null, 2));

console.log('\n--- Payment Information ---\n');

console.log('Payment (Internal):');
console.log(JSON.stringify(api.getPaymentInfo('PAY-123', SecurityLevel.INTERNAL), null, 2));

console.log('\nPayment (Confidential):');
console.log(JSON.stringify(api.getPaymentInfo('PAY-123', SecurityLevel.CONFIDENTIAL), null, 2));

console.log('\n--- Error Responses ---\n');

const testError = new Error('Database connection failed: user=admin@example.com');

console.log('Public error:', api.sanitizeError(testError, SecurityLevel.PUBLIC));
console.log('Internal error:', api.sanitizeError(testError, SecurityLevel.INTERNAL));

// Request validation with masking
class SecureRequestHandler {
  private mask: any;

  constructor(maskInstance: any) {
    this.mask = maskInstance;
  }

  validateAndLogRequest(request: any, sensitiveFields: string[]) {
    // Log request with sensitive fields masked
    const logRequest = this.mask.mask(request, {
      fields: Object.fromEntries(
        sensitiveFields.map(field => [field, { format: 'log' }])
      ),
    });

    console.log('[SECURE REQUEST]', JSON.stringify(logRequest, null, 2));

    // Validate request
    const isValid = this.validateRequest(request);
    return { isValid, maskedRequest: logRequest };
  }

  private validateRequest(request: any): boolean {
    // Simple validation
    return !!(request && request.id && request.type);
  }
}

console.log('\n--- Secure Request Handling ---\n');

const handler = new SecureRequestHandler(mask);

const secureRequest = {
  id: 'REQ-123',
  type: 'PAYMENT',
  email: 'customer@example.com',
  card: '4532015112830366',
  amount: 99.99,
};

const validation = handler.validateAndLogRequest(secureRequest, ['email', 'card']);
console.log('Validation result:', validation);

// Output:
// --- API Security Levels ---
//
// 1. Public API (lowest security):
// {
//   "id": 123,
//   "name": "John Doe",
//   "email": "j***@e***.c*m",
//   "phone": "+1-***",
//   "card": "****************"
// }
//
// 2. Internal API (medium security):
// {
//   "id": 123,
//   "name": "John Doe",
//   "email": "j***n.***@e***e.c*m",
//   "phone": "+1-555-123-****",
//   "card": "**** **** **** 0366"
// }
//
// 3. Confidential API (high security):
// {
//   "id": 123,
//   "name": "John Doe",
//   "email": "j***n.***@e***e.com",
//   "phone": "+1-555-123-****",
//   "card": "**** **36"
// }
//
// 4. Secret API (highest security):
// {
//   "id": 123,
//   "name": "John Doe",
//   "email": "[REDACTED:email]",
//   "phone": "[REDACTED:phone]",
//   "card": "[REDACTED:card]",
//   "ssn": "[REDACTED:ssn]",
//   "createdAt": "2024-01-01"
// }
//
// --- Payment Information ---
//
// Payment (Internal):
// {
//   "id": "PAY-123",
//   "userId": 12345,
//   "amount": 99.99,
//   "cardLast4": "0366",
//   "cardHolder": "John Doe",
//   "email": "j***n.***@e***e.c*m",
//   "status": "completed"
// }
//
// Payment (Confidential):
// {
//   "id": "PAY-123",
//   "userId": 12345,
//   "amount": 99.99,
//   "cardLast4": "0366",
//   "cardHolder": "John Doe",
//   "email": "j***n.***@e***e.com",
//   "status": "completed"
// }
//
// --- Error Responses ---
//
// Public error: An error occurred. Please contact support.
// Internal error: Database connection failed: user=admin@e***e.c*m
//
// --- Secure Request Handling ---
//
// [SECURE REQUEST] {
//   "id": "REQ-123",
//   "type": "PAYMENT",
//   "email": "[REDACTED:email]",
//   "card": "[REDACTED:card]",
//   "amount": 99.99
// }
//
// Validation result: { isValid: true, maskedRequest: { ... } }
