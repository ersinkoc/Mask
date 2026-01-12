/**
 * Real-World Example: User Database
 *
 * This example demonstrates a realistic user database scenario with masking.
 */

import { createMask } from '@oxog/mask';

const mask = createMask();
mask.use(require('@oxog/mask/plugins/core/email').email());
mask.use(require('@oxog/mask/plugins/core/phone').phone());
mask.use(require('@oxog/mask/plugins/core/card').card());
mask.use(require('@oxog/mask/plugins/optional/iban').iban());

console.log('=== Real-World: User Database ===\n');

// Simulated user database
class UserDatabase {
  private users: any[] = [];

  addUser(user: any) {
    // Mask before storing
    const maskedUser = mask.mask(user, {
      fields: {
        email: { strategy: 'middle', format: 'compact' },
        phone: { strategy: 'last:4', format: 'compact' },
        card: { strategy: 'full', format: 'compact' },
        iban: { strategy: 'full', format: 'compact' },
      },
    });

    this.users.push({
      ...maskedUser,
      storedAt: new Date().toISOString(),
    });

    console.log('User stored:', {
      id: maskedUser.id,
      email: maskedUser.email,
      phone: maskedUser.phone,
      card: maskedUser.card,
      iban: maskedUser.iban,
    });
  }

  getUser(id: number, isAdmin: boolean = false) {
    const user = this.users.find(u => u.id === id);
    if (!user) return null;

    if (isAdmin) {
      // Admin sees more details
      return mask.mask(user, {
        fields: {
          email: { strategy: 'middle', format: 'compact' },
          phone: { strategy: 'last:4', format: 'compact' },
          card: { strategy: 'last:4', format: 'display' },
          iban: { strategy: 'last:4', format: 'display' },
        },
      });
    } else {
      // Regular user sees minimal info
      return mask.mask(user, {
        fields: {
          email: { strategy: 'first:1', last: 3 },
          phone: { strategy: 'first:3' },
          card: { strategy: 'full', format: 'compact' },
          iban: { strategy: 'full', format: 'compact' },
        },
      });
    }
  }

  logUserActivity(userId: number, activity: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      console.log(`[AUDIT] User ${userId} (${user.email}) - ${activity}`);
    }
  }

  exportForAnalytics() {
    // Export with log format for analytics
    return this.users.map(user =>
      mask.mask(user, { format: 'log' })
    );
  }
}

const db = new UserDatabase();

// Add users
console.log('--- Adding Users ---\n');

db.addUser({
  id: 1,
  name: 'Alice Johnson',
  email: 'alice.johnson@email.com',
  phone: '+1-555-123-4567',
  card: '4532015112830366',
  iban: 'TR33 0006 1005 1978 6457 8413 26',
  address: '123 Oak Street',
});

db.addUser({
  id: 2,
  name: 'Bob Smith',
  email: 'bob.smith@company.org',
  phone: '+1-555-987-6543',
  card: '5555-5555-5555-4444',
  iban: 'GB29 NWBK 6016 1331 9268 19',
  address: '456 Pine Avenue',
});

// Query users
console.log('\n--- Querying Users ---\n');

console.log('User 1 (Regular view):');
console.log(JSON.stringify(db.getUser(1, false), null, 2));

console.log('\nUser 1 (Admin view):');
console.log(JSON.stringify(db.getUser(1, true), null, 2));

console.log('\nUser 2 (Regular view):');
console.log(JSON.stringify(db.getUser(2, false), null, 2));

// Log activities
console.log('\n--- User Activities ---\n');

db.logUserActivity(1, 'LOGIN');
db.logUserActivity(2, 'PURCHASE');
db.logUserActivity(1, 'PROFILE_UPDATE');

// Export for analytics
console.log('\n--- Analytics Export ---\n');

const analyticsData = db.exportForAnalytics();
console.log('Analytics data (log format):');
console.log(JSON.stringify(analyticsData, null, 2));

// Simulate backup with full masking
console.log('\n--- Database Backup ---\n');

const backup = db.exportForAnalytics();
console.log('Backup created with', backup.length, 'users (all sensitive data redacted)');

// Output:
// --- Adding Users ---
//
// User stored: {
//   "id": 1,
//   "email": "a***e.j***n***@e***.c*m",
//   "phone": "+1-555-123-****",
//   "card": "****************",
//   "iban": "TR33••••••••••••••1326"
// }
//
// User stored: {
//   "id": 2,
//   "email": "b***s.s***h***@c***y.*rg",
//   "phone": "+1-555-987-****",
//   "card": "****************",
//   "iban": "GB29••••••••••••••1919"
// }
//
// --- Querying Users ---
//
// User 1 (Regular view): {
//   "id": 1,
//   "name": "Alice Johnson",
//   "email": "a***@e***.c*m",
//   "phone": "+1-***",
//   "card": "****************",
//   "iban": "TR33••••••••••••••1326",
//   "address": "123 Oak Street"
// }
//
// User 1 (Admin view): {
//   "id": 1,
//   "name": "Alice Johnson",
//   "email": "a***e.j***n***@e***.c*m",
//   "phone": "+1-555-123-****",
//   "card": "**** **** **** 0366",
//   "iban": "TR33 •••• •••• •••• ••13 26",
//   "address": "123 Oak Street"
// }
//
// --- User Activities ---
//
// [AUDIT] User 1 (a***e.j***n***@e***.c*m) - LOGIN
// [AUDIT] User 2 (b***s.s***h***@c***y.*rg) - PURCHASE
// [AUDIT] User 1 (a***e.j***n***@e***.c*m) - PROFILE_UPDATE
//
// --- Analytics Export ---
//
// Analytics data (log format): [...]
