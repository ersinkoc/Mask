/**
 * Test fixtures for card testing
 */

export const validCards = [
  '4532015112830366',
  '5555555555554444',
  '4012888888881881',
  '4222222222222',
  '378282246310005',
  '6011111111111117',
  '3530111333300000',
  '4000000000000002',
];

export const invalidCards = [
  '1234567890123456',
  '0000000000000000',
  '4532015112830367',
  '123',
  '',
  'abcd1234',
];

export const cardMaskingTestCases = [
  {
    input: '4532015112830366',
    expected: {
      default: '**** **** **** 0366',
      full: '****************0366',
      first6: '453201**********',
      last4: '************0366',
      middle: '45***********66',
      compact: '************0366',
      log: '[REDACTED:card]',
    },
  },
  {
    input: '5555555555554444',
    expected: {
      default: '**** **** **** 4444',
      last4: '************4444',
    },
  },
];

export const cardStrategies = [
  'full',
  'middle',
  'first:6',
  'last:4',
  'partial:0.3',
];

export const cardFormats = ['display', 'compact', 'log'] as const;

export const cardChars = ['*', '•', '█', 'X', '#'] as const;
