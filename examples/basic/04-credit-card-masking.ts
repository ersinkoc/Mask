/**
 * Credit Card Masking Example
 *
 * This example demonstrates credit card masking with Luhn validation.
 */

import { createMask } from '@oxog/mask';

const mask = createMask();
mask.use(require('@oxog/mask/plugins/core/card').card());

console.log('=== Credit Card Masking ===\n');

const cards = [
  '4532015112830366',  // Visa
  '5555555555554444',  // Mastercard
  '4012888888881881',  // Visa
  '378282246310005',    // American Express
];

for (const card of cards) {
  const masked = mask.card(card);
  console.log(`Original: ${card}`);
  console.log(`Masked:   ${masked}`);
  console.log(`Format:   ${mask.card(card, { format: 'display' })}`);
  console.log();
}

// Output:
// Original: 4532015112830366
// Masked:   ************0366
// Format:   **** **** **** 0366
//
// ... etc
