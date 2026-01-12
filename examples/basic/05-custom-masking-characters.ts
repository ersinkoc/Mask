/**
 * Custom Masking Characters Example
 *
 * This example demonstrates using different masking characters.
 */

import { createMask } from '@oxog/mask';

const mask = createMask();
mask.use(require('@oxog/mask/plugins/core/email').email());
mask.use(require('@oxog/mask/plugins/core/phone').phone());
mask.use(require('@oxog/mask/plugins/core/card').card());

console.log('=== Custom Masking Characters ===\n');

// Different masking characters
const email1 = mask.email('john.doe@example.com', { char: '•' });
const email2 = mask.email('john.doe@example.com', { char: '█' });
const email3 = mask.email('john.doe@example.com', { char: '#' });

console.log(`Email (•): ${email1}`);
console.log(`Email (█): ${email2}`);
console.log(`Email (#): ${email3}`);

console.log('\n=== Phone Numbers ===\n');

const phone1 = mask.phone('+1-555-123-4567', { char: 'X' });
const phone2 = mask.phone('+1-555-123-4567', { char: '•' });

console.log(`Phone (X): ${phone1}`);
console.log(`Phone (•): ${phone2}`);

console.log('\n=== Credit Cards ===\n');

const card1 = mask.card('4532015112830366', { char: '•' });
const card2 = mask.card('4532015112830366', { char: '█' });

console.log(`Card (•): ${card1}`);
console.log(`Card (█): ${card2}`);

// Output:
// === Custom Masking Characters ===
//
// Email (•): j••n.d•••@e••••••.c••
// Email (█): j██n.d███@e██████.c██
// Email (#): j##n.d###@e######.c##
//
// === Phone Numbers ===
//
// Phone (X): +1-XXX-XXX-4567
// Phone (•): +1-•••-•••-4567
//
// === Credit Cards ===
//
// Card (•): •••••••••••••0366
// Card (█): ████████████0366
