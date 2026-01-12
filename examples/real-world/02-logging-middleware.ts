/**
 * Real-World Example: Logging Middleware
 *
 * This example demonstrates middleware for automatic request/response logging with masking.
 */

import { createMask } from '@oxog/mask';

const mask = createMask();
mask.use(require('@oxog/mask/plugins/core/email').email());
mask.use(require('@oxog/mask/plugins/core/phone').phone());
mask.use(require('@oxog/mask/plugins/core/card').card());

console.log('=== Real-World: Logging Middleware ===\n');

// Simulated Express-like middleware
class LoggingMiddleware {
  private mask: any;

  constructor(maskInstance: any) {
    this.mask = maskInstance;
  }

  // Request logging middleware
  logRequest(req: any, res: any, next: () => void) {
    const startTime = Date.now();

    // Mask request body
    const maskedBody = req.body
      ? this.mask.mask(req.body, { format: 'log' })
      : null;

    console.log(`[REQUEST] ${req.method} ${req.path}`);
    console.log('Body:', maskedBody);

    // Override res.json to mask response
    const originalJson = res.json.bind(res);
    res.json = (data: any) => {
      const duration = Date.now() - startTime;
      const maskedResponse = this.mask.mask(data, { format: 'log' });

      console.log(`[RESPONSE] ${req.path} (${duration}ms)`);
      console.log('Response:', maskedResponse);

      return originalJson(data);
    };

    next();
  }

  // Audit logging for sensitive operations
  auditLog(action: string, data: any, userId?: number) {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      action,
      userId,
      data: this.mask.mask(data, { format: 'log' }),
    };

    console.log('[AUDIT]', JSON.stringify(auditEntry, null, 2));
  }

  // Error logging
  logError(error: Error, context: any) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      context: this.mask.mask(context, { format: 'log' }),
    };

    console.log('[ERROR]', JSON.stringify(errorLog, null, 2));
  }
}

const logger = new LoggingMiddleware(mask);

// Simulate middleware usage
const mockRequest = {
  method: 'POST',
  path: '/api/users',
  body: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-123-4567',
  },
};

const mockResponse = {
  json: function(data: any) {
    console.log('Sending response:', data);
    return data;
  },
};

console.log('--- Middleware in Action ---\n');

// Simulate request processing
console.log('1. Incoming request:');
console.log(mockRequest);

console.log('\n2. Processing with middleware:');
logger.logRequest(mockRequest, mockResponse as any, () => {
  const responseData = {
    success: true,
    user: {
      id: 12345,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-123-4567',
    },
  };

  (mockResponse as any).json(responseData);
});

// Audit logs
console.log('\n3. Audit logging:');

logger.auditLog('USER_LOGIN', {
  email: 'jane.smith@company.com',
  ip: '192.168.1.100',
  userAgent: 'Mozilla/5.0',
}, 12345);

logger.auditLog('PAYMENT_PROCESSED', {
  transactionId: 'TXN-789',
  amount: 99.99,
  cardLast4: '0366',
  customerEmail: 'buyer@example.com',
});

// Error logging
console.log('\n4. Error logging:');

try {
  throw new Error('Payment failed');
} catch (error) {
  logger.logError(error as Error, {
    userId: 12345,
    email: 'user@example.com',
    amount: 99.99,
  });
}

// Production log handler
class ProductionLogger {
  private mask: any;

  constructor(maskInstance: any) {
    this.mask = maskInstance;
  }

  handleLog(level: string, message: string, meta: any) {
    // Always mask sensitive data in production
    const maskedMeta = this.mask.mask(meta, { format: 'log' });
    const logEntry = {
      level,
      message,
      meta: maskedMeta,
      timestamp: new Date().toISOString(),
    };

    // In production, this would write to a logging service
    console.log(`[${level}] ${message}`, maskedMeta);
  }

  info(message: string, meta?: any) {
    this.handleLog('INFO', message, meta);
  }

  warn(message: string, meta?: any) {
    this.handleLog('WARN', message, meta);
  }

  error(message: string, meta?: any) {
    this.handleLog('ERROR', message, meta);
  }
}

console.log('\n5. Production logger:');

const prodLogger = new ProductionLogger(mask);

prodLogger.info('User action', {
  userId: 12345,
  email: 'user@example.com',
  action: 'UPDATE_PROFILE',
});

prodLogger.error('API failure', {
  endpoint: '/api/payment',
  email: 'customer@example.com',
  errorCode: 'TIMEOUT',
});

// Output:
// --- Middleware in Action ---
//
// 1. Incoming request: { method: 'POST', path: '/api/users', body: { ... } }
//
// 2. Processing with middleware:
// [REQUEST] POST /api/users
// Body: [REDACTED:email]
// [RESPONSE] /api/users (5ms)
// Response: {
//   "success": true,
//   "user": {
//     "id": 12345,
//     "name": "John Doe",
//     "email": "[REDACTED:email]",
//     "phone": "[REDACTED:phone]"
//   }
// }
//
// 3. Audit logging:
// [AUDIT] {
//   "timestamp": "2024-01-15T10:30:00.000Z",
//   "action": "USER_LOGIN",
//   "userId": 12345,
//   "data": {
//     "email": "[REDACTED:email]",
//     "ip": "192.168.1.100",
//     "userAgent": "Mozilla/5.0"
//   }
// }
//
// [AUDIT] {
//   "timestamp": "2024-01-15T10:30:00.000Z",
//   "action": "PAYMENT_PROCESSED",
//   "userId": undefined,
//   "data": {
//     "transactionId": "TXN-789",
//     "amount": 99.99,
//     "cardLast4": "0366",
//     "customerEmail": "[REDACTED:email]"
//   }
// }
//
// 4. Error logging:
// [ERROR] {
//   "timestamp": "2024-01-15T10:30:00.000Z",
//   "message": "Payment failed",
//   "stack": "Error: Payment failed ...",
//   "context": {
//     "userId": 12345,
//     "email": "[REDACTED:email]",
//     "amount": 99.99
//   }
// }
//
// 5. Production logger:
// [INFO] User action { email: '[REDACTED:email]', action: 'UPDATE_PROFILE' }
// [ERROR] API failure { email: '[REDACTED:email]', errorCode: 'TIMEOUT' }
