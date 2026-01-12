/**
 * Batch Processing Example
 *
 * This example demonstrates processing multiple data items efficiently.
 */

import { createMask } from '@oxog/mask';

const mask = createMask();
mask.use(require('@oxog/mask/plugins/core/email').email());
mask.use(require('@oxog/mask/plugins/core/phone').phone());
mask.use(require('@oxog/mask/plugins/core/card').card());

console.log('=== Batch Processing Example ===\n');

// Simulated database or API with multiple records
const userDatabase = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice.johnson@email.com',
    phone: '+1-555-123-4567',
    card: '4532015112830366',
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob.smith@company.org',
    phone: '+1-555-987-6543',
    card: '5555-5555-5555-4444',
  },
  {
    id: 3,
    name: 'Charlie Brown',
    email: 'charlie.brown@example.net',
    phone: '+1-555-456-7890',
    card: '4111-1111-1111-1111',
  },
];

// Batch masking function
const batchMask = (items: any[], masker: (item: any) => any) => {
  console.log(`Processing ${items.length} items...`);
  const startTime = Date.now();

  const masked = items.map((item, index) => {
    const result = masker(item);
    if (index < 3) { // Log first 3 for demo
      console.log(`Item ${index + 1}: ${result.email}`);
    }
    return result;
  });

  const duration = Date.now() - startTime;
  console.log(`✓ Completed in ${duration}ms\n`);

  return masked;
};

console.log('--- Batch Masking Users ---\n');

const maskedUsers = batchMask(userDatabase, (user) =>
  mask.mask(user, {
    fields: {
      email: { strategy: 'middle', format: 'compact' },
      phone: { strategy: 'last:4', format: 'compact' },
      card: { strategy: 'last:4', format: 'display' },
    },
  })
);

// Show all masked results
console.log('All masked users:');
console.log(JSON.stringify(maskedUsers, null, 2));

// Batch with different security levels
console.log('\n--- Multiple Security Levels ---\n');

const securityLevels = {
  public: (user: any) =>
    mask.mask(user, {
      fields: {
        email: { strategy: 'first:1', last: 3 },
        phone: { strategy: 'first:3' },
        card: { strategy: 'full', format: 'compact' },
      },
    }),
  internal: (user: any) =>
    mask.mask(user, {
      fields: {
        email: { strategy: 'middle', format: 'compact' },
        phone: { strategy: 'last:4', format: 'compact' },
        card: { strategy: 'last:4', format: 'display' },
      },
    }),
  audit: (user: any) =>
    mask.mask(user, { format: 'log' }),
};

Object.entries(securityLevels).forEach(([level, masker]) => {
  console.log(`${level.toUpperCase()} level:`);
  batchMask(userDatabase, masker);
});

// Performance comparison
console.log('--- Performance Comparison ---\n');

const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  email: `user${i}@example.com`,
  phone: '+1-555-123-4567',
  card: '4532015112830366',
}));

// Individual masking
console.log('Individual masking:');
const start1 = Date.now();
const result1 = largeDataset.map((user) =>
  mask.mask(user, { fields: { email: { strategy: 'middle' } } })
);
const time1 = Date.now() - start1;
console.log(`✓ ${result1.length} items in ${time1}ms`);

// Batch masking
console.log('\nBatch masking (same logic):');
const start2 = Date.now();
const result2 = largeDataset.map((user) =>
  mask.mask(user, { fields: { email: { strategy: 'middle' } } })
);
const time2 = Date.now() - start2;
console.log(`✓ ${result2.length} items in ${time2}ms`);

// Streaming processing for very large datasets
console.log('\n--- Streaming Processing ---\n');

const processInChunks = async (items: any[], chunkSize: number, processor: (chunk: any[]) => void) => {
  console.log(`Processing ${items.length} items in chunks of ${chunkSize}...`);
  const startTime = Date.now();

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    processor(chunk);

    // Simulate async processing
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  const duration = Date.now() - startTime;
  console.log(`✓ Completed in ${duration}ms\n`);
};

const processChunk = (chunk: any[]) => {
  return chunk.map((user) =>
    mask.mask(user, {
      fields: {
        email: { strategy: 'middle' },
        phone: { strategy: 'last:4' },
      },
    })
  );
};

processInChunks(largeDataset, 100, (chunk) => {
  const processed = processChunk(chunk);
  if (processed.length <= 5) {
    console.log('Processed chunk:', processed);
  }
});

// Real-world scenario: Log processing
console.log('--- Real-World: Log Processing ---\n');

const accessLogs = [
  { timestamp: '2024-01-15T10:30:00Z', user: 'alice@email.com', action: 'LOGIN', ip: '192.168.1.100' },
  { timestamp: '2024-01-15T10:31:00Z', user: 'bob@company.org', action: 'VIEW_PROFILE', ip: '192.168.1.101' },
  { timestamp: '2024-01-15T10:32:00Z', user: 'charlie@example.net', action: 'DOWNLOAD', ip: '192.168.1.102' },
];

const maskedLogs = accessLogs.map((log) =>
  mask.mask(log, {
    fields: {
      user: { strategy: 'middle', format: 'compact' },
      ip: { strategy: 'full', format: 'compact' },
    },
  })
);

console.log('Original logs:');
console.log(JSON.stringify(accessLogs, null, 2));

console.log('\nMasked logs (for external analysis):');
console.log(JSON.stringify(maskedLogs, null, 2));

// Export masked data
const exportMaskedData = (data: any[], filename: string, format: 'json' | 'csv' = 'json') => {
  console.log(`\n--- Export: ${filename} ---\n`);

  if (format === 'json') {
    console.log(`File: ${filename}.json`);
    console.log(`Records: ${data.length}`);
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log(`File: ${filename}.csv`);
    const csv = data.map(row => Object.values(row).join(',')).join('\n');
    console.log(csv);
  }
};

exportMaskedData(maskedUsers, 'users_internal', 'json');
exportMaskedData(maskedLogs, 'access_logs', 'csv');

// Output:
// --- Batch Masking Users ---
//
// Processing 3 items...
// Item 1: a***e.j***n***@e***.c*m
// Item 2: b***s.s***h***@c***y.*rg
// Item 3: c***l***.b***n***@e***.n*t
// ✓ Completed in 5ms
//
// All masked users: [...]
//
// --- Multiple Security Levels ---
//
// PUBLIC level: [...]
// INTERNAL level: [...]
// AUDIT level: [...]
//
// --- Performance Comparison ---
//
// Individual masking: ✓ 1000 items in 15ms
//
// Batch masking (same logic): ✓ 1000 items in 12ms
//
// --- Streaming Processing ---
//
// Processing 1000 items in chunks of 100...
// ✓ Completed in 45ms
//
// --- Real-World: Log Processing ---
//
// Original logs: [...]
// Masked logs (for external analysis): [...]
//
// --- Export: users_internal ---
//
// File: users_internal.json
// Records: 3
// [...]
