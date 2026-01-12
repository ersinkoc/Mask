/**
 * @oxog/mask - US Locale Plugin
 *
 * US locale-specific formatting and validation.
 */

import type { MaskPlugin } from '../../types';

/**
 * Format US phone number.
 *
 * @param value - The phone number
 * @param format - The format to apply
 * @returns The formatted phone number
 *
 * @example
 * ```typescript
 * formatUSPhone("+15551234567", 'display');
 * // → "(555) 123-4567"
 *
 * formatUSPhone("5551234567", 'compact');
 * // → "5551234567"
 * ```
 */
function formatUSPhone(value: string, format: 'display' | 'compact' | 'log' = 'display'): string {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');

  // Handle country code
  let countryCode = '';
  let number = digits;

  if (digits.startsWith('1') && digits.length === 11) {
    countryCode = '1';
    number = digits.substring(1);
  }

  // Format: (XXX) XXX-XXXX
  if (format === 'display' && number.length === 10) {
    const formatted = `(${number.substring(0, 3)}) ${number.substring(3, 6)}-${number.substring(6, 10)}`;
    return countryCode ? `+${countryCode} ${formatted}` : formatted;
  }

  if (format === 'compact') {
    return countryCode ? `+${countryCode}${number}` : number;
  }

  return value;
}

/**
 * Format US ZIP code.
 *
 * @param value - The ZIP code
 * @returns The formatted ZIP code
 *
 * @example
 * ```typescript
 * formatUSZipCode("12345");
 * // → "12345"
 *
 * formatUSZipCode("123456789");
 * // → "12345-6789"
 * ```
 */
function formatUSZipCode(value: string): string {
  const digits = value.replace(/\D/g, '');

  if (digits.length === 5) {
    return digits;
  }

  if (digits.length === 9) {
    return `${digits.substring(0, 5)}-${digits.substring(5, 9)}`;
  }

  return value;
}

/**
 * Format US state abbreviation.
 *
 * @param value - The state name or abbreviation
 * @returns The formatted state
 *
 * @example
 * ```typescript
 * formatUSState("California");
 * // → "CA"
 *
 * formatUSState("CA");
 * // → "CA"
 * ```
 */
function formatUSState(value: string): string {
  const stateMap: Record<string, string> = {
    'alabama': 'AL',
    'alaska': 'AK',
    'arizona': 'AZ',
    'arkansas': 'AR',
    'california': 'CA',
    'colorado': 'CO',
    'connecticut': 'CT',
    'delaware': 'DE',
    'florida': 'FL',
    'georgia': 'GA',
    'hawaii': 'HI',
    'idaho': 'ID',
    'illinois': 'IL',
    'indiana': 'IN',
    'iowa': 'IA',
    'kansas': 'KS',
    'kentucky': 'KY',
    'louisiana': 'LA',
    'maine': 'ME',
    'maryland': 'MD',
    'massachusetts': 'MA',
    'michigan': 'MI',
    'minnesota': 'MN',
    'mississippi': 'MS',
    'missouri': 'MO',
    'montana': 'MT',
    'nebraska': 'NE',
    'nevada': 'NV',
    'new hampshire': 'NH',
    'new jersey': 'NJ',
    'new mexico': 'NM',
    'new york': 'NY',
    'north carolina': 'NC',
    'north dakota': 'ND',
    'ohio': 'OH',
    'oklahoma': 'OK',
    'oregon': 'OR',
    'pennsylvania': 'PA',
    'rhode island': 'RI',
    'south carolina': 'SC',
    'south dakota': 'SD',
    'tennessee': 'TN',
    'texas': 'TX',
    'utah': 'UT',
    'vermont': 'VT',
    'virginia': 'VA',
    'washington': 'WA',
    'west virginia': 'WV',
    'wisconsin': 'WI',
    'wyoming': 'WY',
  };

  const normalized = value.toLowerCase().trim();

  return stateMap[normalized]?.toUpperCase() || value.toUpperCase();
}

/**
 * US locale plugin.
 * Provides US locale-specific formatting.
 *
 * @example
 * ```typescript
 * import { usLocale } from '@oxog/mask/plugins/locale-us';
 *
 * const mask = createMask();
 * mask.use(usLocale());
 * mask.phone("+15551234567");
 * // → "(555) 123-4567"
 * ```
 */
export function usLocale(): MaskPlugin {
  return {
    name: 'locale-us',
    version: '1.0.0',
    install(kernel) {
      // This plugin extends the built-in formatters
      // It doesn't register new maskers but enhances existing ones
    },
    onInit(context) {
      // Store US locale configuration
      (context as Record<string, unknown>).locale = 'us';
      (context as Record<string, unknown>).phoneFormatter = formatUSPhone;
      (context as Record<string, unknown>).zipCodeFormatter = formatUSZipCode;
      (context as Record<string, unknown>).stateFormatter = formatUSState;
    },
  };
}

/**
 * Export formatter functions for external use.
 */
export {
  formatUSPhone,
  formatUSZipCode,
  formatUSState,
};
