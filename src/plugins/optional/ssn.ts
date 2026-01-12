/**
 * @oxog/mask - SSN Masker Plugin
 *
 * Social Security Number (US) masking.
 */

import type { MaskPlugin, MaskOptions } from '../../types';
import { InvalidValueError } from '../../errors';
import { isValidSSN } from '../../utils/validation';
import { applyStrategy } from '../../strategies';
import { applyFormat } from '../../formats';

/**
 * SSN masker function.
 *
 * @param value - The SSN to mask
 * @param options - Masking options
 * @returns The masked SSN
 *
 * @example
 * ```typescript
 * maskSSN("123-45-6789", { strategy: 'middle' });
 * // → "***-**-6789"
 *
 * maskSSN("123456789", {
 *   strategy: 'first:3',
 *   format: 'compact'
 * });
 * // → "123******"
 * ```
 */
function maskSSN(value: string, options: MaskOptions = {}): string {
  // Validate input
  if (typeof value !== 'string') {
    throw new InvalidValueError('SSN must be a string', { value, type: 'ssn' });
  }

  // Validate SSN format
  if (!isValidSSN(value)) {
    throw new InvalidValueError('Invalid SSN format', { value, type: 'ssn' });
  }

  // Extract digits only for masking
  const digits = value.replace(/\D/g, '');

  // Default strategy: show last 4
  const strategy = options.strategy || 'last:4';
  const char = options.char || '*';

  // Apply strategy to the digits
  const maskedDigits = applyStrategy(digits, strategy, char);

  // Apply format
  const format = options.format || 'display';
  const maskedSSN = applyFormat(maskedDigits, 'ssn', format);

  return maskedSSN;
}

/**
 * Get the last 4 digits of an SSN.
 *
 * @param value - The SSN
 * @returns The last 4 digits or '****' if invalid
 *
 * @example
 * ```typescript
 * getSSNLastFour("123-45-6789");
 * // → "6789"
 *
 * getSSNLastFour("123");
 * // → "****"
 * ```
 */
export function getSSNLastFour(value: string): string {
  const digits = value.replace(/\D/g, '');

  if (digits.length < 4) {
    return '****';
  }

  return digits.slice(-4);
}

/**
 * Format SSN with standard separators.
 *
 * @param value - The SSN digits
 * @returns The formatted SSN (AAA-GG-SSSS)
 *
 * @example
 * ```typescript
 * formatSSN("123456789");
 * // → "123-45-6789"
 *
 * formatSSN("12345");
 * // → "12-345"
 * ```
 */
export function formatSSN(value: string): string {
  const digits = value.replace(/\D/g, '');

  if (digits.length === 0) {
    return '';
  }

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 5) {
    return `${digits.substring(0, 3)}-${digits.substring(3)}`;
  }

  return `${digits.substring(0, 3)}-${digits.substring(3, 5)}-${digits.substring(5, 9)}`;
}

/**
 * SSN masker plugin.
 * Provides Social Security Number masking functionality.
 *
 * @example
 * ```typescript
 * import { ssn } from '@oxog/mask/plugins/ssn';
 *
 * const mask = createMask();
 * mask.use(ssn());
 * mask.ssn("123-45-6789");
 * // → "***-**-6789"
 * ```
 */
export function ssn(): MaskPlugin {
  return {
    name: 'ssn',
    version: '1.0.0',
    install(kernel) {
      kernel.registerMasker('ssn', maskSSN);
    },
  };
}

/**
 * Export the masker function for direct use.
 */
export const maskSSNFunction = maskSSN;
