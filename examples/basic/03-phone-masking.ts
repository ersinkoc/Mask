/**
 * Phone Number Masking Example
 *
 * This example demonstrates phone number masking with country codes.
 */

import { createMask } from '@oxog/mask';

const mask = createMask();
mask.use(require('@oxog/mask/plugins/core/phone').phone());

console.log('=== Phone Number Masking ===\n');

const phoneNumbers = [
  '+1-555-123-4567',
  '+44 20 7123 4567',
  '+90 532 123 4567',
  '555-987-6543',
];

for (const phone of phoneNumbers) {
  const masked = mask.phone(phone);
  console.log(`Original: ${phone}`);
  console.log(`Masked:   ${masked}`);
  console.log();
}

// Output:
// Original: +1-555-123-4567
// Masked:   +1-***-***-4567
//
// Original: +44 20 7123 4567
// Masked:   +44 ** *** **** 4567
//
// ... etc
