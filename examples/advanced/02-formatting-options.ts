/**
 * Formatting Options Example
 *
 * This example demonstrates different output formatting options.
 */

import { createMask } from '@oxog/mask';

const mask = createMask();
mask.use(require('@oxog/mask/plugins/core/email').email());
mask.use(require('@oxog/mask/plugins/core/card').card());
mask.use(require('@oxog/mask/plugins/core/phone').phone());
mask.use(require('@oxog/mask/plugins/core/iban').iban());

console.log('=== Display Format (Human Readable) ===\n');
console.log(`Email: ${mask.email('john.doe@example.com', { format: 'display' })}`);
console.log(`Card:  ${mask.card('4532015112830366', { format: 'display' })}`);
console.log(`Phone: ${mask.phone('+1-555-123-4567', { format: 'display' })}`);

console.log('\n=== Compact Format (No Spaces) ===\n');
console.log(`Card: ${mask.card('4532 0151 1283 0366', { format: 'compact' })}`);
console.log(`IBAN: ${mask.iban('TR33 0006 1005 1978 6457 8413 26', { format: 'compact' })}`);

console.log('\n=== Log Format (Redacted) ===\n');
console.log(`Email: ${mask.email('john.doe@example.com', { format: 'log' })}`);
console.log(`Card:  ${mask.card('4532015112830366', { format: 'log' })}`);
console.log(`Phone: ${mask.phone('+1-555-123-4567', { format: 'log' })}`);

// Output:
// Display Format (Human Readable)
// Email: j***n.***@e***e.com
// Card:  **** **** **** 0366
// Phone: +1-***-***-4567
//
// Compact Format (No Spaces)
// Card: ************0366
// IBAN: TR33••••••••••••••1326
//
// Log Format (Redacted)
// Email: [REDACTED:email]
// Card:  [REDACTED:card]
// Phone: [REDACTED:phone]
