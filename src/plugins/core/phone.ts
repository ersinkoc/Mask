/**
 * @oxog/mask - Phone Masker Plugin
 *
 * Phone number masking with country code handling.
 */

import type { MaskPlugin, MaskOptions } from '../../types';
import { InvalidValueError } from '../../errors';
import { isValidPhone } from '../../utils/validation';
import { applyStrategy } from '../../strategies';
import { applyFormat } from '../../formats';

/**
 * Phone masker function.
 *
 * @param value - The phone number to mask
 * @param options - Masking options
 * @returns The masked phone number
 *
 * @example
 * ```typescript
 * maskPhone("+905551234567", { strategy: 'middle' });
 * // → "+90*****4567"
 *
 * maskPhone("+1-555-123-4567", {
 *   strategy: 'last:4',
 *   format: 'display'
 * });
 * // → "***-***-4567"
 * ```
 */
function maskPhone(value: string, options: MaskOptions = {}): string {
  // Validate input
  if (typeof value !== 'string') {
    throw new InvalidValueError('Phone must be a string', { value, type: 'phone' });
  }

  // Validate phone format
  if (!isValidPhone(value)) {
    throw new InvalidValueError('Invalid phone format', { value, type: 'phone' });
  }

  // Extract country code if present
  const plusMatch = value.match(/^(\+)/);
  const hasPlus = plusMatch !== null;

  // Strip all non-digit characters
  const digitsOnly = value.replace(/\D/g, '');

  // Strategy to apply to the number part
  const strategy = options.strategy || 'middle';
  const char = options.char || '*';

  // For phones, we typically want to mask the middle digits
  // but preserve the country code and last few digits

  let maskedDigits: string;

  if (hasPlus && digitsOnly.length > 10) {
    // International number with country code
    // Extract country code (first 1-4 digits)
    const countryCodeLength = Math.min(4, digitsOnly.length - 10);
    const countryCode = digitsOnly.substring(0, countryCodeLength);
    const numberPart = digitsOnly.substring(countryCodeLength);

    // Mask the number part
    maskedDigits = countryCode + applyStrategy(numberPart, strategy, char);
  } else {
    // Standard 10-digit number or no country code
    // Just mask according to strategy
    maskedDigits = applyStrategy(digitsOnly, strategy, char);
  }

  // Apply format
  const format = options.format || 'display';
  const maskedPhone = applyFormat(maskedDigits, 'phone', format);

  return maskedPhone;
}

/**
 * Phone masker plugin.
 * Provides phone number masking functionality.
 *
 * @example
 * ```typescript
 * import { phone } from '@oxog/mask/plugins/core/phone';
 *
 * const mask = createMask();
 * mask.use(phone());
 * mask.phone("+905551234567");
 * // → "+90*****4567"
 * ```
 */
export function phone(): MaskPlugin {
  return {
    name: 'phone',
    version: '1.0.0',
    install(kernel) {
      kernel.registerMasker('phone', maskPhone);
    },
  };
}

/**
 * Export the masker function for direct use.
 */
export const maskPhoneFunction = maskPhone;
