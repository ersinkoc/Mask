/**
 * Test fixtures for email testing
 */

export const validEmails = [
  'test@example.com',
  'user@domain.org',
  'name.surname@company.co.uk',
  'john.doe@subdomain.example.com',
  'a@b.co',
  'email+tag@domain.com',
  'firstname.lastname@domain.com',
  'email@123.123.123.123',
  '1234567890@example.com',
  'email@example-one.com',
];

export const invalidEmails = [
  'plainaddress',
  '@missingdomain.com',
  'missing-at-sign.net',
  'missing@.com',
  'missing@domain',
  'double..dot@example.com',
];

export const emailMaskingTestCases = [
  {
    input: 'test@example.com',
    expected: {
      default: 't**t@example.com',
      first2: 'te**t@example.com',
      last4: 't**t@example.com',
      full: '****@example.com',
      middle: 't**t@example.com',
      log: '[REDACTED:email]',
    },
  },
  {
    input: 'john.doe@company.co.uk',
    expected: {
      default: 'j******e@company.co.uk',
      first4: 'john.***@company.co.uk',
      last2: 'j******e@company.co.uk',
      partial0_5: 'john.***@company.co.uk',
      full: '********@company.co.uk',
      middle: 'j******e@company.co.uk',
      log: '[REDACTED:email]',
    },
  },
];

export const emailStrategies = [
  'full',
  'middle',
  'first:2',
  'last:4',
  'partial:0.5',
];

export const emailFormats = ['display', 'compact', 'log'] as const;

export const emailChars = ['*', '•', '█', 'X', '#'] as const;
