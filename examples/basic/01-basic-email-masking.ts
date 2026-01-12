/**
 * Basic Email Masking Example
 *
 * This example demonstrates basic email masking functionality.
 */

import { createMask } from '@oxog/mask';

const mask = createMask();
mask.use(require('@oxog/mask/plugins/core/email').email());

// Example emails to mask
const emails = [
  'john.doe@example.com',
  'jane.smith@company.org',
  'admin@website.net',
  'user.name@domain.co.uk',
];

console.log('=== Basic Email Masking ===\n');

for (const email of emails) {
  const masked = mask.email(email);
  console.log(`Original: ${email}`);
  console.log(`Masked:   ${masked}`);
  console.log();
}

// Output:
// Original: john.doe@example.com
// Masked:   j***n.***@e***e.com
//
// Original: jane.smith@company.org
// Masked:   j***e.***@c***y.org
//
// ... etc
