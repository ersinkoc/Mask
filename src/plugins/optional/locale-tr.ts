/**
 * @oxog/mask - Turkish Locale Plugin
 *
 * Turkish locale-specific formatting and validation.
 */

import type { MaskPlugin } from '../../types';

/**
 * Format Turkish phone number.
 *
 * @param value - The phone number
 * @param format - The format to apply
 * @returns The formatted phone number
 *
 * @example
 * ```typescript
 * formatTurkishPhone("+905551234567", 'display');
 * // → "+90 555 123 45 67"
 *
 * formatTurkishPhone("05551234567", 'compact');
 * // → "05551234567"
 * ```
 */
function formatTurkishPhone(value: string, format: 'display' | 'compact' | 'log' = 'display'): string {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');

  // Handle country code
  let countryCode = '';
  let number = digits;

  if (digits.startsWith('90')) {
    countryCode = '90';
    number = digits.substring(2);
  } else if (digits.startsWith('0')) {
    number = digits.substring(1);
  }

  // Format: 0XXX XXX XX XX (with country code: 90 XXX XXX XX XX)
  if (format === 'display' && number.length >= 10) {
    const formatted = `${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6, 8)} ${number.substring(8, 10)}`;
    return countryCode ? `+${countryCode} ${formatted}` : `0${formatted}`;
  }

  if (format === 'compact') {
    return countryCode ? `+${countryCode}${number}` : `0${number}`;
  }

  return value;
}

/**
 * Format Turkish tax number (VKN).
 *
 * @param value - The tax number
 * @returns The formatted tax number
 *
 * @example
 * ```typescript
 * formatTurkishTaxNumber("1234567890");
 * // → "1 234 567 890"
 * ```
 */
function formatTurkishTaxNumber(value: string): string {
  const digits = value.replace(/\D/g, '');

  if (digits.length !== 10) {
    return value;
  }

  return `${digits.substring(0, 1)} ${digits.substring(1, 4)} ${digits.substring(4, 7)} ${digits.substring(7, 10)}`;
}

/**
 * Format Turkish national ID (TC Kimlik No).
 *
 * @param value - The national ID
 * @returns The formatted national ID
 *
 * @example
 * ```typescript
 * formatTurkishNationalID("12345678901");
 * // → "123 456 789 01"
 * ```
 */
function formatTurkishNationalID(value: string): string {
  const digits = value.replace(/\D/g, '');

  if (digits.length !== 11) {
    return value;
  }

  return `${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6, 9)} ${digits.substring(9, 11)}`;
}

/**
 * Turkish locale plugin.
 * Provides Turkish locale-specific formatting.
 *
 * @example
 * ```typescript
 * import { trLocale } from '@oxog/mask/plugins/locale-tr';
 *
 * const mask = createMask();
 * mask.use(trLocale());
 * mask.phone("+905551234567");
 * // → "+90 555 123 45 67"
 * ```
 */
export function trLocale(): MaskPlugin {
  return {
    name: 'locale-tr',
    version: '1.0.0',
    install(kernel) {
      // This plugin extends the built-in formatters
      // It doesn't register new maskers but enhances existing ones
    },
    onInit(context) {
      // Store Turkish locale configuration
      (context as Record<string, unknown>).locale = 'tr';
      (context as Record<string, unknown>).phoneFormatter = formatTurkishPhone;
      (context as Record<string, unknown>).taxNumberFormatter = formatTurkishTaxNumber;
      (context as Record<string, unknown>).nationalIDFormatter = formatTurkishNationalID;
    },
  };
}

/**
 * Export formatter functions for external use.
 */
export {
  formatTurkishPhone,
  formatTurkishTaxNumber,
  formatTurkishNationalID,
};
