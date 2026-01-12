/**
 * @oxog/mask - IBAN Masker Plugin
 *
 * IBAN (International Bank Account Number) masking.
 */

import type { MaskPlugin, MaskOptions } from '../../types';
import { InvalidValueError } from '../../errors';
import { isValidIBAN } from '../../utils/validation';
import { applyStrategy } from '../../strategies';
import { applyFormat } from '../../formats';

/**
 * IBAN masker function.
 *
 * @param value - The IBAN to mask
 * @param options - Masking options
 * @returns The masked IBAN
 *
 * @example
 * ```typescript
 * maskIBAN("TR330006100519786457841326", { strategy: 'middle' });
 * // → "TR33••••••••••••••1326"
 *
 * maskIBAN("GB29 NWBK 6016 1331 9268 19", {
 *   strategy: 'first:4',
 *   format: 'compact'
 * });
 * // → "GB29******************"
 * ```
 */
function maskIBAN(value: string, options: MaskOptions = {}): string {
  // Validate input
  if (typeof value !== 'string') {
    throw new InvalidValueError('IBAN must be a string', { value, type: 'iban' });
  }

  // Validate IBAN format
  if (!isValidIBAN(value)) {
    throw new InvalidValueError('Invalid IBAN format', { value, type: 'iban' });
  }

  // Remove spaces and convert to uppercase for processing
  const cleanIBAN = value.replace(/\s/g, '').toUpperCase();

  // Default strategy: show first 4 (country code + check digits) and last 4
  const strategy = options.strategy || 'first:4';
  const char = options.char || '*';

  // Extract country code and check digits
  const countryCode = cleanIBAN.substring(0, 2);
  const checkDigits = cleanIBAN.substring(2, 4);

  // Mask the middle part
  const maskedMiddle = applyStrategy(cleanIBAN.substring(4), strategy, char);

  // Combine: country code + check digits + masked middle
  const maskedIBAN = countryCode + checkDigits + maskedMiddle;

  // Apply format
  const format = options.format || 'display';
  const formattedIBAN = applyFormat(maskedIBAN, 'iban', format);

  return formattedIBAN;
}

/**
 * Get the country code from an IBAN.
 *
 * @param value - The IBAN
 * @returns The country code or null if invalid
 *
 * @example
 * ```typescript
 * getIBANCountry("TR330006100519786457841326");
 * // → "TR"
 *
 * getIBANCountry("GB29 NWBK 6016 1331 9268 19");
 * // → "GB"
 * ```
 */
export function getIBANCountry(value: string): string | null {
  const cleanIBAN = value.replace(/\s/g, '').toUpperCase();

  if (cleanIBAN.length < 2) {
    return null;
  }

  return cleanIBAN.substring(0, 2);
}

/**
 * IBAN masker plugin.
 * Provides IBAN masking functionality.
 *
 * @example
 * ```typescript
 * import { iban } from '@oxog/mask/plugins/iban';
 *
 * const mask = createMask();
 * mask.use(iban());
 * mask.iban("TR330006100519786457841326");
 * // → "TR33••••••••••••••1326"
 * ```
 */
export function iban(): MaskPlugin {
  return {
    name: 'iban',
    version: '1.0.0',
    install(kernel) {
      kernel.registerMasker('iban', maskIBAN);
    },
  };
}

/**
 * Export the masker function for direct use.
 */
export const maskIBANFunction = maskIBAN;
