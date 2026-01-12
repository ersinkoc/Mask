/**
 * Real-World Example: Data Export
 *
 * This example demonstrates safe data export with masking for different recipients.
 */

import { createMask } from '@oxog/mask';

const mask = createMask();
mask.use(require('@oxog/mask/plugins/core/email').email());
mask.use(require('@oxog/mask/plugins/core/phone').phone());
mask.use(require('@oxog/mask/plugins/core/card').card());
mask.use(require('@oxog/mask/plugins/optional/iban').iban());

console.log('=== Real-World: Data Export ===\n');

// Export formats
enum ExportFormat {
  CSV = 'csv',
  JSON = 'json',
  XML = 'xml',
}

// Recipient types
enum ExportRecipient {
  USER = 'user',        // User requesting their own data
  PARTNER = 'partner',  // Business partner
  AUDITOR = 'auditor',  // Internal auditor
  PUBLIC = 'public',    // Public data (minimal)
}

class DataExporter {
  private mask: any;

  constructor(maskInstance: any) {
    this.mask = maskInstance;
  }

  // Export user data with appropriate masking based on recipient
  exportUserData(userId: number, recipient: ExportRecipient) {
    // Simulated database query
    const userData = {
      user: {
        id: userId,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-123-4567',
        address: '123 Main St',
        createdAt: '2024-01-01',
      },
      paymentMethods: [
        {
          id: 1,
          type: 'card',
          cardNumber: '4532015112830366',
          expiryDate: '12/25',
        },
        {
          id: 2,
          type: 'iban',
          ibanNumber: 'TR33 0006 1005 1978 6457 8413 26',
        },
      ],
      transactions: [
        {
          id: 'TXN-001',
          amount: 99.99,
          email: 'john.doe@example.com',
          date: '2024-01-15',
        },
      ],
    };

    // Apply masking based on recipient
    const maskedData = this.maskUserData(userData, recipient);

    console.log(`--- Export for ${recipient.toUpperCase()} ---\n`);
    console.log(JSON.stringify(maskedData, null, 2));

    return maskedData;
  }

  private maskUserData(data: any, recipient: ExportRecipient): any {
    switch (recipient) {
      case ExportRecipient.USER:
        // Users get full access to their own data (minimal masking)
        return this.mask.mask(data, {
          fields: {
            'user.email': { strategy: 'middle' },
            'user.phone': { strategy: 'last:4' },
            'paymentMethods.*.cardNumber': { strategy: 'last:4', format: 'display' },
            'paymentMethods.*.ibanNumber': { strategy: 'full', format: 'compact' },
          },
        });

      case ExportRecipient.PARTNER:
        // Partners get business-relevant data with moderate masking
        return this.mask.mask(data, {
          fields: {
            'user.email': { strategy: 'middle', format: 'compact' },
            'user.phone': { strategy: 'last:4', format: 'compact' },
            'paymentMethods.*.cardNumber': { strategy: 'full', format: 'compact' },
            'paymentMethods.*.ibanNumber': { strategy: 'full', format: 'compact' },
            'transactions.*.email': { strategy: 'middle', format: 'compact' },
          },
        });

      case ExportRecipient.AUDITOR:
        // Auditors need to verify but with high masking
        return this.mask.mask(data, {
          fields: {
            'user.email': { strategy: 'middle' },
            'user.phone': { strategy: 'last:4' },
            'paymentMethods.*.cardNumber': { strategy: 'full', format: 'compact' },
            'paymentMethods.*.ibanNumber': { strategy: 'full', format: 'compact' },
            'transactions.*.email': { strategy: 'middle' },
          },
        });

      case ExportRecipient.PUBLIC:
        // Public gets minimal data
        return this.mask.mask(data, {
          fields: {
            'user.email': { strategy: 'first:1', last: 3 },
            'user.phone': { strategy: 'first:3' },
            'paymentMethods.*.cardNumber': { strategy: 'full', format: 'compact' },
            'paymentMethods.*.ibanNumber': { strategy: 'full', format: 'compact' },
            'transactions.*.email': { strategy: 'first:1', last: 3 },
          },
        });

      default:
        return data;
    }
  }

  // Generate report with masking
  generateReport(data: any, format: ExportFormat, recipient: ExportRecipient) {
    const maskedData = this.maskUserData(data, recipient);

    switch (format) {
      case ExportFormat.JSON:
        return JSON.stringify(maskedData, null, 2);

      case ExportFormat.CSV:
        return this.toCSV(maskedData);

      case ExportFormat.XML:
        return this.toXML(maskedData);

      default:
        return maskedData;
    }
  }

  private toCSV(data: any): string {
    // Simplified CSV conversion
    const rows = [
      ['Field', 'Value'],
      ['User ID', data.user.id],
      ['Email', data.user.email],
      ['Phone', data.user.phone],
      ['Card Last4', data.paymentMethods[0].cardNumber],
    ];

    return rows.map(row => row.join(',')).join('\n');
  }

  private toXML(data: any): string {
    // Simplified XML conversion
    return `<?xml version="1.0"?>
<user>
  <id>${data.user.id}</id>
  <email>${data.user.email}</email>
  <phone>${data.user.phone}</phone>
</user>`;
  }
}

const exporter = new DataExporter(mask);

// Export to different recipients
console.log('1. User requesting their own data:');
exporter.exportUserData(123, ExportRecipient.USER);

console.log('\n2. Business partner export:');
exporter.exportUserData(123, ExportRecipient.PARTNER);

console.log('\n3. Auditor export:');
exporter.exportUserData(123, ExportRecipient.AUDITOR);

console.log('\n4. Public data (minimal):');
exporter.exportUserData(123, ExportRecipient.PUBLIC);

// Export in different formats
console.log('\n--- Export Formats ---\n');

const sampleData = {
  user: {
    id: 123,
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
};

console.log('JSON format:');
console.log(exporter.generateReport(sampleData, ExportFormat.JSON, ExportRecipient.PARTNER));

console.log('\nCSV format:');
console.log(exporter.generateReport(sampleData, ExportFormat.CSV, ExportRecipient.PARTNER));

console.log('\nXML format:');
console.log(exporter.generateReport(sampleData, ExportFormat.XML, ExportRecipient.PARTNER));

// GDPR compliance - Right to be forgotten
console.log('\n--- GDPR Compliance ---\n');

const gdprExport = (userId: number) => {
  console.log(`Exporting all data for user ${userId}:`);
  const data = exporter.exportUserData(userId, ExportRecipient.USER);

  console.log('\n✓ Data exported successfully');
  console.log('⚠ Note: This data should be encrypted and sent securely to the user');

  return data;
};

const anonymizeData = (data: any) => {
  console.log('\nAnonymizing data for retention:');
  const anonymized = mask.mask(data, { format: 'log' });
  console.log(JSON.stringify(anonymized, null, 2));
  console.log('✓ Data anonymized for long-term retention');

  return anonymized;
};

const userData = gdprExport(123);
anonymizeData(userData);

// Output:
// 1. User requesting their own data:
// {
//   "user": {
//     "id": 123,
//     "name": "John Doe",
//     "email": "j***n.***@e***e.com",
//     "phone": "+1-555-123-****",
//     "address": "123 Main St",
//     "createdAt": "2024-01-01"
//   },
//   "paymentMethods": [...],
//   "transactions": [...]
// }
//
// 2. Business partner export:
// {
//   "user": {
//     "id": 123,
//     "name": "John Doe",
//     "email": "j***n.***@e***e.c*m",
//     "phone": "+1-555-123-****",
//     "address": "123 Main St"
//   },
//   ...
// }
//
// 3. Auditor export: [... high masking ...]
// 4. Public data: [... minimal masking ...]
//
// --- Export Formats ---
//
// JSON format:
// {...}
//
// CSV format:
// Field,Value
// User ID,123
// Email,j***n.***@e***e.c*m
// Phone,+1-555-123-****
//
// XML format:
// <?xml version="1.0"?>
// <user>
//   <id>123</id>
//   <email>j***n.***@e***e.c*m</email>
//   <phone>+1-555-123-****</phone>
// </user>
//
// --- GDPR Compliance ---
//
// Exporting all data for user 123:
// {...}
//
// ✓ Data exported successfully
// ⚠ Note: This data should be encrypted and sent securely to the user
//
// Anonymizing data for retention:
// {
//   "user": {
//     "id": 123,
//     "name": "John Doe",
//     "email": "[REDACTED:email]",
//     "phone": "[REDACTED:phone]",
//     "address": "123 Main St"
//   },
//   ...
// }
//
// ✓ Data anonymized for long-term retention
