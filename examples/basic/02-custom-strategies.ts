/**
 * Custom Masking Strategies Example
 *
 * This example demonstrates using different masking strategies.
 */

import { createMask } from '@oxog/mask';

const mask = createMask();
mask.use(require('@oxog/mask/plugins/core/email').email());
mask.use(require('@oxog/mask/plugins/core/card').card());

console.log('=== Email with Different Strategies ===\n');

const email = 'john.doe@example.com';
console.log(`Original:      ${email}`);
console.log(`Full Mask:     ${mask.email(email, { strategy: 'full' })}`);
console.log(`Middle:        ${mask.email(email, { strategy: 'middle' })}`);
console.log(`First 2:       ${mask.email(email, { strategy: 'first:2' })}`);
console.log(`Last 4:        ${mask.email(email, { strategy: 'last:4' })}`);
console.log(`Partial 50%:   ${mask.email(email, { strategy: 'partial:0.5' })}`);

console.log('\n=== Credit Card with Different Strategies ===\n');

const cardNumber = '4532015112830366';
console.log(`Original:           ${cardNumber}`);
console.log(`Show last 4:       ${mask.card(cardNumber, { strategy: 'last:4' })}`);
console.log(`Show first 6:      ${mask.card(cardNumber, { strategy: 'first:6' })}`);
console.log(`Full Mask:         ${mask.card(cardNumber, { strategy: 'full' })}`);

// Output:
// Email with Different Strategies
// Original:      john.doe@example.com
// Full Mask:     ****************
// Middle:        j***n.***@e***e.com
// First 2:       jo***n.***@e***e.com
// Last 4:        j***n.***@***.com
// Partial 50%:   joh***.***@e***e.com
