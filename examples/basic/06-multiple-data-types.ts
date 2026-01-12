/**
 * Multiple Data Types Example
 *
 * This example demonstrates masking different types of data.
 */

import { createMask } from '@oxog/mask';

const mask = createMask();
mask.use(require('@oxog/mask/plugins/core/email').email());
mask.use(require('@oxog/mask/plugins/core/phone').phone());
mask.use(require('@oxog/mask/plugins/core/card').card());
mask.use(require('@oxog/mask/plugins/optional/iban').iban());
mask.use(require('@oxog/mask/plugins/optional/ip').ip());

console.log('=== Multiple Data Types ===\n');

console.log('Email:');
console.log(`  ${mask.email('john.doe@company.com')}`);
console.log(`  ${mask.email('jane.smith@example.org')}`);

console.log('\nPhone:');
console.log(`  ${mask.phone('+1-555-123-4567')}`);
console.log(`  ${mask.phone('+90-555-987-6543')}`);

console.log('\nCredit Card:');
console.log(`  ${mask.card('4532015112830366')}`);
console.log(`  ${mask.card('5555-5555-5555-4444')}`);

console.log('\nIBAN:');
console.log(`  ${mask.iban('TR33 0006 1005 1978 6457 8413 26')}`);
console.log(`  ${mask.iban('GB29 NWBK 6016 1331 9268 19')}`);

console.log('\nIP Address:');
console.log(`  ${mask.ip('192.168.1.1')}`);
console.log(`  ${mask.ip('2001:0db8:85a3:0000:0000:8a2e:0370:7334')}`);

// Output:
// === Multiple Data Types ===
//
// Email:
//   j***n.d***@c*****y.c**
//   j***s******@e*****e.o**
//
// Phone:
//   +1-***-***-4567
//   +90-***-***-6543
//
// Credit Card:
//   **** **** **** 0366
//   **** **** **** 4444
//
// IBAN:
//   TR33 •••• •••• •••• ••13 26
//   GB29 •••• •••• •••• ••19
//
// IP Address:
//   192.***.***.*
