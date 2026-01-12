/**
 * Test fixtures for phone testing
 */

export const validPhones = [
  '+905551234567',
  '+1-555-123-4567',
  '+44 20 7123 4567',
  '555-123-4567',
  '(555) 123-4567',
  '5551234567',
  '+1 555 123 4567',
  '020 7123 4567',
  '+90 555 123 45 67',
  '5551234567890',
];

export const invalidPhones = [
  'abc',
  '+',
  '+1',
  '+12345678901234567890',
  '',
];

export const phoneMaskingTestCases = [
  {
    input: '+905551234567',
    expected: {
      default: '+90*****4567',
      full: '*************',
      first2: '+9***********',
      last4: '+90*****4567',
      middle: '+9*****4567',
    },
  },
  {
    input: '555-123-4567',
    expected: {
      default: '***-***-4567',
      full: '***********',
      last4: '***-***-4567',
    },
  },
];

export const phoneStrategies = [
  'full',
  'middle',
  'first:2',
  'last:4',
  'partial:0.5',
];

export const phoneFormats = ['display', 'compact', 'log'] as const;

export const phoneChars = ['*', '•', '█', 'X', '#'] as const;
